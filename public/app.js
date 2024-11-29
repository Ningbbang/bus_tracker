let lat, lng;

navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude
    lng = position.coords.longitude

    document.getElementById("lat").innerText = lat
    document.getElementById("lng").innerText = lng
});

// async function getMap(){
//     navigator.geolocation.getCurrentPosition((position) => {
//         lat = position.coords.latitude
//         lng = position.coords.longitude
    
//         document.getElementById("lat").innerText = lat
//         document.getElementById("lng").innerText = lng

//         const map_container = document.getElementById("map")
//         var map = new google.maps.Map(map_container, {
//             center : {lat: lat, lng: lng},
//             zoom : 10
//         })
//         var marker = new google.maps.Marker({
//             map, position : {lat: lat, lng: lng},
//             popup : "My Location"
//         })
//     })
// };
// getMap();

function sendLocationToServer() {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          
          // Send location to the server
          fetch("/update-location", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(locationData),
          });
        //   getMap();
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }
  
  sendLocationToServer();