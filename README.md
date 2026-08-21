# parkrun

Prints a list of all parkrun events in Germany. :runner:  
This includes the lovely [Aachener Weiher parkrun](https://www.parkrun.com.de/aachenerweiher/) in Cologne. :heart: 

Example output:

```
1. Georgengarten parkrun (Georgengarten, Hannover): 276 runs since 02.12.2017 - https://www.parkrun.com.de/georgengarten/
2. Neckarau parkrun (Neckarau, Mannheim): 273 runs since 02.12.2017 - https://www.parkrun.com.de/neckarau/
3. Küchenholz parkrun (Küchenholz, Leipzig): 242 runs since 02.12.2017 - https://www.parkrun.com.de/kuechenholz/
4. Nidda parkrun (Nidda, Frankfurt Main): 260 runs since 06.01.2018 - https://www.parkrun.com.de/nidda/
5. Hasenheide parkrun (Hasenheide Park, Berlin): 260 runs since 06.01.2018 - https://www.parkrun.com.de/hasenheide/
6. Rubbenbruchsee parkrun (Rubbenbruchsee, Osnabrück): 268 runs since 13.01.2018 - https://www.parkrun.com.de/rubbenbruchsee/
7. Wöhrder See parkrun (Wöhrder See, Nürnberg): 242 runs since 14.04.2018 - https://www.parkrun.com.de/woehrdersee/
8. Kräherwald parkrun (Kräherwald, Stuttgart): 254 runs since 05.05.2018 - https://www.parkrun.com.de/kraeherwald/
9. Seewoog parkrun (Seewoog, Ramstein-Miesenbach): 232 runs since 15.09.2018 - https://www.parkrun.com.de/seewoog/
10. Schwanenteich parkrun (Stadtpark, Giessen): 229 runs since 29.09.2018 - https://www.parkrun.com.de/schwanenteich/
11. Leinpfad parkrun (Stadtpark, Merzig): 219 runs since 05.01.2019 - https://www.parkrun.com.de/leinpfad/
12. Alstervorland parkrun (Alstervorland, Hamburg): 212 runs since 12.01.2019 - https://www.parkrun.com.de/alstervorland/
13. Westpark parkrun (Westpark, München): 215 runs since 19.01.2019 - https://www.parkrun.com.de/westpark/
14. Rheinaue parkrun (Rheinaue, Bonn): 210 runs since 02.02.2019 - https://www.parkrun.com.de/rheinaue/
15. Aachener Weiher parkrun (Aachener Weiher, Köln): 210 runs since 23.03.2019 - https://www.parkrun.com.de/aachenerweiher/

[...]

56. Bahnstadt Promenade parkrun (): 39 runs since 30.09.2023 - https://www.parkrun.com.de/bahnstadtpromenade/
57. Ehrenbreitstein parkrun (Ehrenbreitstein): 22 runs since 13.01.2024 - https://www.parkrun.com.de/ehrenbreitstein/
58. Lousberg parkrun (Lousberg): 23 runs since 20.01.2024 - https://www.parkrun.com.de/lousberg/
59. Prestelsee parkrun (Prestelsee): 15 runs since 16.03.2024 - https://www.parkrun.com.de/prestelsee/

Retrieved Mon Jul 01 2024 17:50:21 GMT+0200 (Central European Summer Time)
```

## Requirements

- [Node.js](https://nodejs.org/) v26 or newer installed

## Usage

1. Run `npm install`
2. Enter your parkrun credentials in `.env`
3. Execute the script: `npm start`

## References

* Swagger [API documentation](https://developer.parkrun.com/) of the parkrun API  
  *Note*: At the moment the API is intended for [internal use](https://www.parkrun.com/api/), only. And the API documentation seems to be outdated.
* [parkrun.js](https://parkrun.js.org/): (inofficial) library for accessing the parkrun API. This project does not depend on it. But I used it to reverse-engineer the API.