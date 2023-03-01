var map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

var sourceMarker = null;
var destinationMarker = null;

function findRoute() {
    var source = document.getElementById("source").value;
    var destination = document.getElementById("destination").value;

    // Use AJAX to call a server-side script that finds the route
    // and returns the result in JSON format

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var route = JSON.parse(this.responseText);
            document.getElementById("route").innerHTML = route;

            // Add markers for the source and destination cities
            if (sourceMarker) {
                map.removeLayer(sourceMarker);
            }

            if (destinationMarker) {
                map.removeLayer(destinationMarker);
            }

            var sourceCoords = route.sourceCoords;
            var destinationCoords = route.destinationCoords;

            sourceMarker = L.marker([sourceCoords.lat, sourceCoords.lng]).addTo(map);
            destinationMarker = L.marker([destinationCoords.lat, destinationCoords.lng]).addTo(map);

            // Fit the map to the bounds of the markers
            var bounds = L.latLngBounds(sourceMarker.getLatLng(), destinationMarker.getLatLng());
            map.fitBounds(bounds);
        }
    };

    xhttp.open("GET", "find_route.php?source=" + source + "&destination=" + destination, true);
    xhttp.send();
}