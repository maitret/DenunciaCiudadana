
if(navigator.geolocation) {
//navigator.geolocation.watchPosition(showPosition);
navigator.geolocation.getCurrentPosition(showPosition, onError, { enableHighAccuracy: true });
} else {
//alert("Geolicalizacion no soportada.");
}
function showPosition(position) {
//var geo_info = "lat="+position.coords.latitude + "&lon="+ position.coords.longitude + "&alt="+ position.coords.altitude + "&pos_acc="+ position.coords.accuracy + "&pos_altacc="+ position.coords.altitudeAccuracy + "&pos_heading="+ position.coords.heading + "&pos_speed="+ position.coords.speed + "&pos_time="+ position.timestamp + "";
window.localStorage.setItem("User_Lat", position.coords.latitude);
window.localStorage.setItem("User_Lon", position.coords.longitude);
}
function onError(error) {
alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
var geo_info = "pos_ec=" + error.code + "&pos_em=" + error.message + "";
}	 

// Config
L.mapbox.accessToken = config.mapbox.accessToken;

// Utilities
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Get current UUID
var myUuid = localStorage.getItem('myUuid');
if (!myUuid) {
  myUuid = guid();
  localStorage.setItem('myUuid', myUuid);
}

// Initialize map
var User_Lat = localStorage.getItem("User_Lat");
var User_Lon = localStorage.getItem("User_Lon");
var map = L.mapbox.map('map', config.mapbox.mapId, {
  zoomControl: false,
  attributionControl: false,
  tileLayer: {
    maxNativeZoom: 18
  }
//}).setView([48.861920, 2.341755], 18)
}).setView([User_Lat, User_Lon], 18);

// Stupid routing
var mapId = location.hash.replace(/^#/, '');
if (!mapId) {
  mapId = (Math.random() + 1).toString(36).substring(2, 12);
 // location.hash = mapId;
}

// Firebase
var firebase = new Firebase('https://' + config.firebase + '.firebaseio.com/');
//var markersRef = firebase.child('maps/' + mapId);
var markersRef = firebase.child('maps/demo');
var markers = {};

function addPoint(uuid, position) {
  var marker = L.marker([position.coords.latitude, position.coords.longitude], {
    // zIndexOffset: (uuid === myUuid ? 1000 : 0),
    icon: L.mapbox.marker.icon({
      'marker-size': 'large',
      'marker-color': (uuid === myUuid ? '#2196f3' : '#ff9800')
    })
  });
  marker.addTo(map);

  markers[uuid] = marker;

  map.fitBounds(Object.keys(markers).map(function(uuid) {
    return markers[uuid].getLatLng()
  }))
}

function removePoint(uuid) {
  map.removeLayer(markers[uuid]);
  //markers[uuid] = null
}

function updatePoint(uuid, position) {
  var marker = markers[uuid];
  marker.setLatLng([position.coords.latitude, position.coords.longitude])
}

function putPoint(uuid, position) {
  if (markers[uuid])
    updatePoint(uuid, position);
  else
    addPoint(uuid, position)
}

var watchPositionId;
map.on('ready', function() {
  function successCoords(position) {
    if (!position.coords) return;

    markersRef.child(myUuid).set({
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      timestamp: Math.floor(Date.now() / 1000)
    });

    // map.panTo([position.coords.latitude, position.coords.longitude])
  }

  function errorCoords() {
    console.log('Unable to get current position')
  }

  watchPositionId = navigator.geolocation.watchPosition(successCoords, errorCoords);

  markersRef.on('child_added', function(childSnapshot) {
    var uuid = childSnapshot.key();
    var position = childSnapshot.val();

    addPoint(uuid, position)
  });

  markersRef.on('child_changed', function(childSnapshot) {
    var uuid = childSnapshot.key();
    var position = childSnapshot.val();

    putPoint(uuid, position)
  });

  markersRef.on('child_removed', function(oldChildSnapshot) {
    var uuid = oldChildSnapshot.key();

    removePoint(uuid)
  })
});

// Remove old markers
setInterval(function() {
  markersRef.limitToFirst(100).once('value', function(snap) {
    var now = Math.floor(Date.now() / 1000);

    snap.forEach(function(childSnapshot) {
      var uuid = childSnapshot.key();
      if (childSnapshot.val().timestamp < now - 60 * 30) {
        markersRef.child(uuid).set(null);
        //markers[uuid] = null
      }
    })
  })
}, 5000);