// Calling the geojson url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Performing a GET request to the query URL/
d3.json(url).then(function(data) {

    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

function getColor(depth) {
    if (depth < 10) {
        return "#77FF33"
    } else if (depth < 30) {
        return "#6EAD2A"
    } else if (depth < 50) {
        return "#F6F92F"
    } else if (depth < 70) {
        return "#F9AC2F"
    } else if (depth < 90) {
        return "#F9471B"
    } else {
        return "#5D1200"
    }
};

// Creating a function for the earthquakeData
function createFeatures(earthquakeData) {

    //Define a function that runs once for each feature in teh features array.
    //Give each feature a popup that place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}<h3><hr><p>Location: ${new Date(feature.properties.place)}</
        p>,p>Depth: ${(feature.geometry.coordinates[2])} km</p>`);
    }

    // Create the geoJSON layers
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return new L.CircleMarker(latlng, {
                radius: feature.properties.mag * 4,
                fillOpacity: 0.5,
                stroke: true,
                color: 'black',
                weight: 1,
                fillColor: getColor(feature.geometry.coordinates[2])
            })
        }
    });

    // Creating the map for the earthquakes
    createMap(earthquakes);
}
// Creating the earthquakes map function
function createMap(earthquakes) {

    //Create the base layers.
    var gray = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {  
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        accessToken: API_KEY,
        id: "mapbox/streets-v11"
    });

    // Setting up the legend
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Depth of Epicenter</strong>'];
        example = [9, 15, 40, 60, 80, 99];
        categories = ['<10', '10-30', '30-50', '50-70', '70-90', '90+'];

        // Going through each magnitude item to label and color the legend
        // Push the labels arrary as list item
        for (var i = 0; i < categories.length; i++) {
            div.innerHTML +=
                labels.push(
                    '<i class = "circle" style = "background:' + getColor(example[i]) + '"></i> ' +
                    (categories[i] ? categories[i] : '+'));

        }
        // Joining the list of item to the div
        div.innerHTML = labels.join('<br>');
        return div;
    }

    // Generating the parameters to create the map
    var myMap = L.map("map", {
        center: [
            37.0902, -110.7129
        ],
        zoom: 5

    });

    gray.addTo(myMap);
    earthquakes.addTo(myMap);
    legend.addTo(myMap);
}