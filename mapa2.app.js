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

var latitude = ""; var longitude = ""; 
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
window.coords_lat = position.coords.latitude;
window.coords_lon = position.coords.longitude;
//var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//map.setCenter(pos);
}
function onError(error) {
//alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
var geo_info = "pos_ec=" + error.code + "&pos_em=" + error.message + "";
}

var infowindow = null;
//var map;
var directionsDisplay = new google.maps.DirectionsRenderer();
var directionsService = new google.maps.DirectionsService();

//$(document).ready(function() {
jQuery(document).ready(function($) {
initialize();
});

// Firebase
var firebase = new Firebase('https://' + config.firebase + '.firebaseio.com/');
//var markersRef = firebase.child('maps/' + mapId);
var markersRef = firebase.child('maps/demo');
var markers = {};

var User_Lat = localStorage.getItem("User_Lat");
var User_Lon = localStorage.getItem("User_Lon");

if(User_Lat == null && User_Lon == null)
{
User_Lat = window.coords_lat;
User_Lon = window.coords_lon;
} 

function initialize() { 
var GetLatLon_F_DU = new google.maps.LatLng(User_Lat, User_Lon);
var centerMap;
centerMap = GetLatLon_F_DU;
var myOptions =
{
zoom: 12,
mapTypeId: google.maps.MapTypeId.ROADMAP,
center: centerMap
};

//map = new google.maps.Map(document.getElementById("map"), myOptions);

var div = document.getElementById("map");
map = plugin.google.maps.Map.getMap(div, myOptions);
map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);

infowindow = new google.maps.InfoWindow({
maxWidth: 500,
content: "Cargando..."
});

function onMapReady() {
alert("Mapa Listo");
}

var MycontentString = '<div id="content">'+
'<div id="siteNotice">'+
'</div>'+
'<h3 id="firstHeading" class="firstHeading">Centro de Control</h3>'+
'<div id="bodyContent">'+
'<p>El <b>Centro de Control</b>, es la ubicacion donde se encuentra la agencia de policia (por el momento, es la propia)</p>'+
'</div>'+
'</div>';

var MysiteLatLng = new google.maps.LatLng(User_Lat, User_Lon);
window.MyMarker = new google.maps.Marker({
position: MysiteLatLng,
map: map,
title: 'Mi Ubicacion',
//zIndex: sites[3],
icon: "http://a.tiles.mapbox.com/v4/marker/pin-l+1087bf.png?access_token=pk.eyJ1IjoibWFpdHJldCIsImEiOiI1NTMwMTM4YWUxNjYzZWJiMWRlOGU5OTM2MzgzYTliZiJ9.2XQtvaTJpmvXzDvQTJIHNg",
html: MycontentString,
});
google.maps.event.addListener(MyMarker, "click", function () {
infowindow.setContent(this.html);
infowindow.open(map, this);
});
}

var marker = [];
var json = "";
	
function update_clientes()
{
$.getJSON("http://mensajerus.com/pe/code/info_clientes.json.php", {ajax: 'true'}, function (j) {
//j = JSON.parse(m);
var data_ajax = j['clientes'];
var count_data_ajax = data_ajax.length;
for (var i = 0; i < count_data_ajax; i++) {
if (data_ajax[i].id != "") {
localStorage.setItem(data_ajax[i].id, JSON.stringify(data_ajax[i]));
}
}
});
}
update_clientes();

function template_content(id_cliente){
/*
info_id_cliente = localStorage.getItem(id_cliente);
//alert(info_id_cliente); 
if(info_id_cliente != null){
json = JSON.parse(info_id_cliente);
} else {
//info_id_cliente = JSON.stringify(j);
json = JSON.parse(m);
});
}
*/

info_id_cliente = localStorage.getItem(id_cliente);
var cliente = JSON.parse(info_id_cliente);
//var cliente = json['cliente'];
if(cliente){
var popupContent2 = "<div id='content'><div id='siteNotice'></div><h4 id='firstHeading' class='firstHeading'>"+cliente['business_name']+"</h4><div id='bodyContent' class='placeholder'><table class='table table-striped'><tbody><tr><td rowspan='3'><img src='"+cliente['business_photography']+"' height='80' width='80'></td><td>Propietario:</td><td>"+cliente['owner_name']+"</td></tr><tr><td>Dirección:</td><td>"+cliente['address']+"</td></tr><tr><td>Teléfono:</td><td>"+cliente['telephone']+"</td></tr></tbody></table></div></div>";
return popupContent2; 
} else {
mapId = (Math.random() + 1).toString(36).substring(2, 12);
//window.location = "?refresh_markers="+mapId;
}
}


function addPoint(uuid, position) {
var link_detener = ""; var icon_alerta = "";
if(position.alerta == 1) {
link_detener = "<div class='pull-right'><a href='#' class='btn btn-success btn-sm' onclick=\"DetenerAlarma('"+uuid+"')\";>Detener <i class='fa fa-stop'></i> <i class='fa fa-bell'></i></a></div>";
}
//alert(position.coords.latitude+","+position.coords.longitude); 
if(typeof(position.coords.latitude) !== undefined && typeof(position.coords.longitude) !== "undefined" ) {

//var popupContent = link_detener + " id_cliente: "+position.id_cliente_1+"<br><br>"+""+uuid+": <a href='https://maps.google.com.mx/?q="+position.coords.latitude+","+position.coords.longitude+"&hl=es-419' target='_blank'>"+position.coords.latitude+","+position.coords.longitude+"</a><br><br>"+position.info_cliente+"<br>";

var id_cliente = position.id_cliente_1; 
var content = template_content(id_cliente); 
var popupContent = link_detener + content + " " + id_cliente +" "+uuid+":<br> <a href='https://maps.google.com.mx/?saddr="+position.coords.latitude+","+position.coords.longitude+"&daddr="+User_Lat+","+User_Lon+"&hl=es-419' target='_blank'>Como llegar a "+position.coords.latitude+","+position.coords.longitude+"</a><hr>"+position.info_cliente+""; 


var audio;
window.audio = document.getElementById("alarmAudio");

if(position.alerta == 1) {
color = "FF0000";
//icon_alerta = "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/64/Map-Marker-Push-Pin--Pink.png";
window.audio.play();
} else {
color = "a3e46b";
//icon_alerta = "https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/48/Map-Marker-Push-Pin--Azure.png";
window.audio.pause();
window.audio.currentTime = 0;
}
//var icon_alerta = "https://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=|10|"+color+"|location|24|"+color+"|"+color+"";
var icon_alerta = "http://a.tiles.mapbox.com/v4/marker/pin-l+"+color+".png?access_token=pk.eyJ1IjoibWFpdHJldCIsImEiOiI1NTMwMTM4YWUxNjYzZWJiMWRlOGU5OTM2MzgzYTliZiJ9.2XQtvaTJpmvXzDvQTJIHNg";

var siteLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
window.marker[uuid] = new google.maps.Marker({
position: siteLatLng,
map: map,
title: uuid,
//zIndex: sites[3],
icon: icon_alerta,
//icon: 'https://app.sanzon.mx/img/Marcador.png',
html: popupContent,
});

if(position.alerta == 1) {
window.marker[uuid].setAnimation(google.maps.Animation.BOUNCE);
} else { }

google.maps.event.addListener(marker[uuid], "click", function () {
infowindow.setContent(this.html);
infowindow.open(map, this);
});

if(position.alerta == 1) {
var bounds = new google.maps.LatLngBounds();
bounds.extend(siteLatLng);
//bounds.padding = 20; 
//map.setZoom(16);
map.fitBounds(bounds); 
map.setZoom(map.getZoom() - 2);
//google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) { if (this.getZoom() > 17) { this.setZoom(17); } }); 

} else { }

}
}


function DetenerAlarma(uuid){
markersRef.child(uuid).update({
alerta: '0'
})
}

function removePoint(uuid) {
//  map.removeLayer(markers[uuid])
//markers[uuid] = null
window.marker[uuid].setMap(null);
}

function putPoint(uuid, position) {
if (markers[uuid]){
removePoint(uuid);
addPoint(uuid, position);
//updatePoint(uuid, position)
}
else{
removePoint(uuid);
addPoint(uuid, position)
}
}

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
});

function libera_localstorage(){
localStorage.clear();
mapId = (Math.random() + 1).toString(36).substring(2, 12);
window.location = "?refresh_markers="+mapId;
}


//$(document).ready(function(){
var contentWidth = $('.googlemap').width();
var contentHeight = $('.googlemap').height();
$(".googlemap").each(function(){
var ratio_W = $(this).width()/contentWidth;
var ratio_H = $(this).width()/contentHeight;
$(this).wrap("<div style='width:"+ratio_W+"; height:"+ratio_H+";'></div>");
});
//});

//});