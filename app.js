const { JSDOM } = require("jsdom");

const USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const NZ_EVENT_URL = "https://www.parkrun.co.nz";

async function printEventsInNZ() {
    const {
        PARKRUN_ID,
        PARKRUN_PASSWORD,
        PARKRUN_SERVER,
        PARKRUN_COUNTRY_ID
    } = process.env;

    if (!PARKRUN_ID || !PARKRUN_PASSWORD || !PARKRUN_SERVER || !PARKRUN_COUNTRY_ID) {
        throw new Error(
            "Missing one or more required environment variables: " +
            "PARKRUN_ID, PARKRUN_PASSWORD, PARKRUN_SERVER, PARKRUN_COUNTRY_ID."
        );
    }

    const accessToken = await login(PARKRUN_ID, PARKRUN_PASSWORD);
    const response = await searchEvents(PARKRUN_COUNTRY_ID, accessToken);
    const events = response?.data?.Events;

    if (!Array.isArray(events)) {
        throw new Error(
            `Unexpected event API response: ${JSON.stringify(response)}`
        );
    }

    const details = await Promise.all(events.map(getEventDetails));

    details.sort((a, b) => {
        if (a.firstEvent && b.firstEvent) {
            return a.firstEvent - b.firstEvent ||
                b.totalEventsStaged - a.totalEventsStaged;
        }
        if (a.firstEvent) return -1;
        if (b.firstEvent) return 1;
        return b.totalEventsStaged - a.totalEventsStaged;
    });

    details.forEach((event, index) => logEventDetails(index + 1, event));

    console.log(
        `\nRetrieved ${new Date().toLocaleString("en-NZ", {
            timeZone: "Pacific/Auckland",
            dateStyle: "medium",
            timeStyle: "medium",
            timeZoneName: "long"
        })}`
    );
}

async function searchEvents(countryId, accessToken) {
    const url = new URL(
        `https://${process.env.PARKRUN_SERVER}/v1/countries/${encodeURIComponent(countryId)}/searchEvents`
    );

    url.search = new URLSearchParams({
        expandedDetails: "true",
        access_token: accessToken,
        scope: "app"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Event search failed: HTTP ${response.status} ${response.statusText}`
        );
    }

    return response.json();
}

async function getEventDetails(event) {
    const eventId = event.EventName;

    if (!eventId) {
        throw new Error("An event returned by the API has no EventName.");
    }

    const history = await fetchEventHistory(eventId);
    return extractEventDetails(event, history);
}

async function fetchEventHistory(eventId) {
    const url =
        `${NZ_EVENT_URL}/${encodeURIComponent(eventId)}/results/eventhistory/`;

    const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT }
    });

    if (!response.ok) {
        throw new Error(
            `Fetching event history for ${eventId} failed: ` +
            `HTTP ${response.status} ${response.statusText}`
        );
    }

    return response.text();
}

function extractEventDetails(event, eventHistory) {
    const dom = new JSDOM(eventHistory);
    const rows = dom.window.document.querySelectorAll(
        "tr.Results-table-row"
    );

    const dates = Array.from(rows)
        .map(row => parseDate(row.getAttribute("data-date")))
        .filter(date => date !== null)
        .sort((a, b) => a - b);

    return {
        id: event.EventName,
        longName: event.EventLongName,
        location: event.EventLocation,
        totalEventsStaged: rows.length,
        firstEvent: dates.length > 0 ? dates[0] : null
    };
}

function parseDate(value) {
    if (!value) return null;

    // ISO date: YYYY-MM-DD
    let match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
        const [, year, month, day] = match;
        return validDate(Number(year), Number(month), Number(day));
    }

    // NZ-style date: DD/MM/YYYY
    match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (match) {
        const [, day, month, year] = match;
        return validDate(Number(year), Number(month), Number(day));
    }

    return null;
}

function validDate(year, month, day) {
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        return null;
    }

    return date;
}

function logEventDetails(index, stats) {
    const firstEventDate = stats.firstEvent
        ? stats.firstEvent.toLocaleDateString("en-NZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC"
        })
        : null;

    const runsText = stats.totalEventsStaged > 0
        ? `${stats.totalEventsStaged} runs since ${firstEventDate || "unknown date"}`
        : "0 runs";

    console.log(
        `${index}. ${stats.longName} (${stats.location}): ` +
        `${runsText} - ${NZ_EVENT_URL}/${stats.id}/`
    );
}

async function login(username, password) {
    const url = `https://${process.env.PARKRUN_SERVER}/user_auth.php`;

    const body = new URLSearchParams({
        username,
        password,
        grant_type: "password",
        scope: "app"
    });

    const response = await fetch(url, {
        method: "POST",
        body,
        headers: {
            "Authorization":
                "Basic bmV0ZHJlYW1zLWlwaG9uZS1zMDE6Z2ZLYkRENk5Ka1lvRm1raXNSKGlWRm9wUUNLV3piUWVRZ1pBWlpLSw==",
            "Content-Type":
                "application/x-www-form-urlencoded;charset=UTF-8"
        }
    });

    if (!response.ok) {
        throw new Error(
            `Login failed: HTTP ${response.status} ${response.statusText}`
        );
    }

    const token = await response.json();

    if (token.error || !token.access_token) {
        throw new Error(
            token.error_description ||
            token.error ||
            "No access token returned by the parkrun API."
        );
    }

    return token.access_token;
}

printEventsInNZ().catch(error => {
    console.error("New Zealand parkrun report failed:", error.message);
    process.exitCode = 1;
});
