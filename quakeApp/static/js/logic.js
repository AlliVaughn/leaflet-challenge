
// Start with a map 
var map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4, 
        scrollWheelZoom: false
      });
      
      
      function createFeatures(earthquakeData) {
      
          // Define a function we want to run once for each feature in the features array
          // Give each feature a popup describing the place and time of the earthquake
          function onEachFeature(feature, layer) {
              layer.bindPopup("<h3>" + feature.properties.place + "<hr>" + "Coordinates: " + [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]+
              "<hr>" + new Date(feature.properties.time) + "</p>" + "<hr>" + "Magnitude: " +"<bold>" + feature.properties.mag)+ "/bold>" + " </h3> </p>";
          }
      
          // Create a GeoJSON layer containing the features array on the earthquakeData object
          // Run the onEachFeature function once for each piece of data in the array
          const earthquakes = L.geoJSON(earthquakeData, {
              onEachFeature: onEachFeature, 
              pointToLayer: function (feature, latlng) {
                          return L.circleMarker(latlng, {
                              weight: 1,
                              opacity: 1,
                              fillOpacity: 0.8, 
                              color: assignColor(feature.properties.mag),
                              fillColor: assignColor(feature.properties.mag),
                              radius:  markerSize(feature.properties.mag)
                          });
                      }
          });
      
          // Sending our earthquakes layer to the createMap function
          createMap(earthquakes);
      }
      
      function createMap(earthquakes) {
      
          // Define streetmap and darkmap layers
          const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                  maxZoom: 10,
                  id: "mapbox.streets",
                  accessToken: API_KEY
          });
      
          const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                  maxZoom: 10,
                  id: "mapbox.dark",
                  accessToken: API_KEY
          });
          const outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                  maxZoom: 10,
                  id: "mapbox.outdoors",
                  accessToken: API_KEY
          });
          const satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                  maxZoom: 10,
                  id: "mapbox.satellite",
                  accessToken: API_KEY
          });
          
      
      
          // Define a baseMaps object to hold our base layers
          const baseMaps = {
                  "Street Map": streetmap,
                  "Dark Map": darkmap, 
                  "Outdoor Map": outdoormap, 
                  "Satellite":  satellite
          };
      
          // Create overlay object to hold our overlay layer
          const overlayMaps = {
                  Earthquakes: earthquakes
          };
      
          // Create our map, giving it the streetmap and earthquakes layers to display on load
          var myMap = L.map("map", {
                  center: [37.09, -95.71],
                  zoom: 4,
                  layers: [streetmap, earthquakes]
          });
      
          // Create a layer control
          // Pass in our baseMaps and overlayMaps
          // Add the layer control to the map
          var x = L.control.layers(baseMaps, overlayMaps, {
                  collapsed: false
          }).addTo(myMap);
        }
          
       let legend = L.control({position: 'bottomright'});
       legend.onAdd = function(map) {
         let div = L.DomUtil.create('div', 'info legend'),
           mags = [0, 1, 2, 3, 4, 5],
           labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      
         for (let i = 0; i < mags.length; i++) {
           div.innerHTML += '<i style="background:' + assignColor(mags[i] + 1) + '"></i> ' +
                  mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
         }
      
         return div;
       };
       legend.addTo(map);   
      //Stumbled on this.  It's way more elegant than I first wrote.  
      function assignColor(magnitude) {
          return magnitude > 5 ? "red":
            magnitude > 4 ? "orange":
              magnitude > 3 ? "gold":
                magnitude > 2 ? "yellow":
                  magnitude > 1 ? "yellowgreen":
                    "greenyellow"; // <= 1 default
        }
      
        //Embiggen
        function markerSize(magnitude) {
          return magnitude * 4; 
        }
      
      (async function(){
          // const queryUrl = buildUrl();
          const data = await d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
          //TODO: Add this as well... 
          //const data = await d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson");
          // Once we get a response, send the data.features object to the createFeatures function
          createFeatures(data.features);
      })()