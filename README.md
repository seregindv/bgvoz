https://developers.google.com/maps/documentation/javascript/place-id<br>
https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder<br>
https://jsfiddle.net/f5kvdxbL/6/
```
console.log(`${place.name}: "lat": ${place.geometry.location.lat()}, "lon": ${place.geometry.location.lng()}, "placeId": "${place.place_id}" - https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat()},${place.geometry.location.lng()}&query_place_id=${place.place_id}`);
```
https://osmand.net/go?lat=44.8163488&lon=20.3973201&z=17
