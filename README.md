# Import PDF
1. Find schedule
   * google for "bg voz red" and navigate first link (similar to https://www.srbvoz.rs/wp-content/redvoznje/rv_bg_voza_za_2025.pdf)
   * or navigate to https://w3.srbvoz.rs/redvoznje and choose RED VOŽNJE BG VOZA on the left
2. Open Excel
3. Choose Data -> Get Data -> From File -> From PDF
4. Once loaded, add tables (titled Table### (Page #)) with over 3 rows (right click, choose Load To..., check Table, then New worksheet), do not add pages (titled Page###)
5. Open bgvoz.xslm, open macros (Alt+F11), activate file where tables imported to
6. Switch to macros, open Main, run ExportTrains()
7. Add to json
   * `startDate`: string yyyy-MM-dd, schedule first date
   * `endDate`: schedule last date
   * `holidays`: array of date strings yyyy-MM-dd
      ```
      ["2025-01-01", "2025-01-02", "2025-01-07", "2025-02-15", "2025-02-16", "2025-02-17", "2025-04-18", "2025-04-20", "2025-04-21", "2025-05-01", "2025-05-02", "2025-11-11"]
      ```
      _remember to update year and check dates_
   * `workdayTrains`: array of keys of trains field
   * `holidayTrains`

# Schema
Schema id in g tag id attribute should match Stations field key in train data.

schema.svg
```
<g id="schSt21" class="schema-station"><circle cx="10" cy="45" /><text x="9.25" y="45" text-anchor="end">Vreoci
```
train-data.json
```
"stations": {
  "21": { "name": "Вреоци"
```

https://metromapmaker.com/map/bhXHry1q
https://metromapmaker.com/map/DuLy7zNi
https://metromapmaker.com/map/D8mn9YQx

# Drafts
https://developers.google.com/maps/documentation/javascript/place-id<br>
https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder<br>
https://jsfiddle.net/f5kvdxbL/6/
```
console.log(`${place.name}: "lat": ${place.geometry.location.lat()}, "lon": ${place.geometry.location.lng()}, "placeId": "${place.place_id}" - https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}&query_place_id=${place.place_id}`);
```
https://osmand.net/go?lat=44.8163488&amp;lon=20.3973201&amp;z=17

Show schema (translucent, route bold, outer regular)<br>
Schema: station click -> popup: show on maps, from, to<br>
Search: type &amp; on map<br>
Use GPS - station nearby auto from<br>
```
+-----------------------------------+
| Depart station - Terminal Station |
| --------------   ---------------- |
| 4:50 ------- duration ------ 5:30 |
| from                           to |
| ----       View  Schema        -- |
+-----------------------------------+
```
Each station: om maps, from to<br>
View - route<br>
Schema -> see above<br>
Search (left: location icon, right: schema, clear)
```
+------------------------+
|  O  Od/Do         \/ X |
| \/                /\   |
+------------------------+
```