var config = {
apiKey: "AIzaSyChbHK7RMew8W-RdDOkB54OXAXDjPpSobk",
authDomain: "colonia-segura.firebaseapp.com",
databaseURL: "https://colonia-segura.firebaseio.com",
storageBucket: "colonia-segura.appspot.com",
messagingSenderId: "438952115950"
};
window.cs_fb = firebase.initializeApp(config).database();

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

function guid() {
function s4() {
return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var id_cliente_1 = localStorage.getItem("id_cliente");
if(id_cliente_1 == null){
localStorage.setItem("id_cliente", "5");
} else {  }

var Usuario = localStorage.getItem('usuario');
var myUuid = localStorage.getItem('key');
if (!myUuid) {
myUuid = guid();
localStorage.setItem('key', myUuid);
}

jQuery(document).ready(function($) {
var startPos;
if (navigator.geolocation) {
navigator.geolocation.watchPosition(function(position) {
cs_fb.ref('/users').child(myUuid).update({
coords: {
latitude: position.coords.latitude,
longitude: position.coords.longitude,
},
altitud: position.coords.altitude,
geo_aprox: position.coords.accuracy,
last_geo: position.timestamp,
usuario: Usuario
});

var Lat = position.coords.latitude;
var Lon = position.coords.longitude;
window.lat_global = Lat;
window.lon_global = Lon;

if(Lat != ""){ window.localStorage.setItem("User_Lat", Lat); }
if(Lon != ""){ window.localStorage.setItem("User_Lon", Lon); }
window.localStorage.setItem("Geo_Aprox", position.coords.accuracy);

});
}
});


var app = {
initialize: function() {
this.bindEvents();
},
// 'load', 'deviceready', 'offline', and 'online'.
bindEvents: function() {
document.addEventListener('deviceready', this.onDeviceReady, false);
},
onDeviceReady: function() {
app.setupPush();
app.carga_app();
},
setupPush: function() {
var push = PushNotification.init({
"android": {
"senderID": "438952115950"
},
"ios": {
alert: "true",
badge: "true",
sound: "true",
clearBadge: "true"
},
"windows": {}
});

push.on('registration', function(data) {
//alert(JSON.stringify("reg: "+data));
//$("#info_device").append(JSON.stringify(data));
//console.log('registration event: ' + data.registrationId);
var oldRegId = localStorage.getItem('registrationId');
if (oldRegId !== data.registrationId) {
localStorage.setItem('registrationId', data.registrationId);
window.localStorage.setItem("token_push", JSON.stringify(data));
alert(JSON.stringify(data));
}

});
push.on('error', function(e) {
//alert(JSON.stringify("error: "+e));
//$("#info_device").append(JSON.stringify(e));
//window.localStorage.setItem("token_push", JSON.stringify(e));
});

push.on('notification', function(data) {
//$("#info_device").append(JSON.stringify(data));
//window.localStorage.setItem("token_push", JSON.stringify(data));
if(typeof GetPushNotif == 'function') {
window.GetPushNotif(data);
} else {
window.GetPushNotif = data;
}
/* navigator.notification.alert(
data.message,         // message
null,                 // callback
data.title,           // title
'Ok'                  // buttonName
); */
});
},
carga_app: function(){

}
};