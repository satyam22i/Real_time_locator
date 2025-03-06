const socket = io(); // Connect to Socket.io server

if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    socket.emit("send-loc", { latitude, longitude });
  }, (err) => {
    console.error("some err ", err)

  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
  );
}


const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Made By Satyam"
}).addTo(map)

const marker = {};

socket.on("rec-loc", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude],);
  if (marker[id]) {
    marker[id].setLatLng([latitude, longitude])
  } else {
    marker[id] = L.marker([latitude, longitude]).addTo(map)
      .bindPopup(`User: ${id}`)
      .openPopup();
  }
})

socket.on("user-discon", (id) => {
  if (marker[id]) {
    map.removeLayer(marker[id]);
    delete marker[id];
  }
})