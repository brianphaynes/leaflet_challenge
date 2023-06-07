// Create the map
var map = L.map('map').setView([0, 0], 2);

// Add the tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Fetch the GeoJSON data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // Create a function to determine the marker size based on magnitude
    function getMarkerSize(magnitude) {
      return Math.sqrt(magnitude) * 4;
    }

    
// Create a function to determine the marker color based on magnitude
function getMarkerColor(magnitude) {
    if (magnitude >= 0 && magnitude <= 4) {
      return '#00ff00'; // Green
    } else if (magnitude > 4 && magnitude <= 6) {
      return '#ffff00'; // Yellow
    } else if (magnitude > 6 && magnitude <= 8) {
      return '#ff0000'; // Red
    } else {
      return '#000000'; // Black (fallback color)
    }
  }
  
  

  
  // Create a function to determine the legend color based on magnitude
  function getLegendColor(magnitude) {
    if (magnitude < 3) {
      return '#00ff00'; // Green
    } else if (magnitude < 4) {
      return '#ffff00'; // Yellow
    } else {
      return '#ff0000'; // Red
    }
  }
  
  

    // Loop through the features and add markers to the map
    L.geoJSON(data.features, {
      pointToLayer: function (feature, latlng) {
        var magnitude = feature.properties.mag;
        var depth = feature.geometry.coordinates[2];
        var markerSize = getMarkerSize(magnitude);
        var markerColor = getMarkerColor(magnitude);
;

        var marker = L.circleMarker(latlng, {
          radius: markerSize,
          fillColor: markerColor,
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });

        // Add a popup to the marker
        marker.bindPopup(
          `<b>Location:</b> ${feature.properties.place}<br>` +
          `<b>Magnitude:</b> ${magnitude}<br>` +
          `<b>Depth:</b> ${depth}`
        );

        return marker;
      }
    }).addTo(map);

   // Create a legend
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'legend');
  var magnitudes = [0, 1, 2, 3, 4, 5];
  var labels = [];

  // Generate labels and colors for the legend
  for (var i = 0; i < magnitudes.length; i++) {
    var magnitude = magnitudes[i];
    var markerColor = getLegendColor(magnitude); // Use the getLegendColor() function to get the color for each magnitude range

    var label = (magnitude === 5) ? `${magnitude}+` : `${magnitude}-${magnitude}`;
    labels.push(
      `<div>
        <i style="background:${markerColor};"></i>
        <span>${label}</span>
      </div>`
    );
  }

  div.innerHTML = `<div><b>Magnitude</b></div>${labels.join('')}`;
  return div;
};

// Add legend to the map
legend.addTo(map);
});