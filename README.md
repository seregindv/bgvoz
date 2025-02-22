https://metromapmaker.com/map/bhXHry1q
https://metromapmaker.com/map/DuLy7zNi

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