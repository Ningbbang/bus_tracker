let lat, lng, users;
const markers = []
let currentWatcherId = null;

async function getData(){
  const data = await fetch("/users.json");
  const users = await data.json();

  document.getElementById("location").innerHTML = "";
  document.getElementById("info").innerHTML = "";

  users.forEach((user) => {
    document.getElementById("location").innerHTML += 
    `<li class="loca-item"><a href="/bus/${user["bus"]}">${user["bus"]}</li>`

    document.getElementById("info").innerHTML += 
    `<li class="info-item"><a href="/location/${user["bus"]}">${user["bus"]}</li>`
  })
};
getData();

/* Map */
const map = L.map("map").setView([37.2, 127.2], 15); // Default coordinates and zoom

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '© OpenStreetMap contributors',
  maxZoom: 15,
}).addTo(map);

var busIcon = L.icon({
  iconUrl : '/bus.png'  
})
let markerGroup = L.layerGroup().addTo(map);
const busMarker = L.marker([37.2, 127.2], {icon: busIcon}).bindPopup("Bus Location").addTo(map);

/* Fetch Bus Locations */
async function fetchBusLocations(bus_code) {
  const response = await fetch(`/bus/${bus_code}/data`);
  const locations = await response.json();

  console.log(locations)
  if (locations.error) {
    console.error(locations.error);
    return;
}
  const georesponse = await fetch(`/${bus_code}.geojson`);
  const geojson = await georesponse.json();

  const stopresponse = await fetch("/stop.json");
  const stopjson = await stopresponse.json();
  const target_stop = stopjson.filter((d) => d["bus"] === bus_code)

  target_stop.forEach((data) => {
    const marker = L.marker([data["lat"], data["lng"]]).bindPopup(data["popup"]);
    markerGroup.addLayer(marker)
  });
  
  /* geoJSON file */
  if(geo_route) {
    geo_route.clearLayer();
  }
  var geo_route = L.geoJSON(geojson)
  geo_route.addTo(map)


  if (locations) {
    const updateLocation = () => {
      const { latitude, longitude, time } = locations;
      busMarker.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude], 15);
      console.log(`Updated location for bus ${bus_code}:`, latitude, longitude);
    };

    // Run the update function immediately
    updateLocation();

    // Schedule updates every 3 seconds
    setInterval(updateLocation, 3000);
  } else {
    alert(`Bus code ${bus_code} not found in locations.`);
    console.error(`Bus code ${bus_code} not found in locations.`);
  }
}

function showLocation() {
  const locationMenu = document.getElementById("location");
  toggleMenu(locationMenu);
}

function showInfo() {
  const infoMenu = document.getElementById("info");
  toggleMenu(infoMenu);
}

function toggleMenu(menu) {
  // Hide any currently visible menu
  const allMenus = document.querySelectorAll(".sub-menu");
  allMenus.forEach((m) => {
      if (m !== menu) m.style.display = "none";
  });

  // Toggle the clicked menu
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}