
var app = {
    initialize: function() {
    this.bindEvents();
    },
    bindEvents: function() {
  document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');





    },
receivedEvent: function(id) {
console.log('Received Event: ' + id);
    }
};

var pushNotification;
function onDeviceReadyPush() {
$("#app-status-ul").append('<li>deviceready event received</li>');
/*
document.addEventListener("backbutton", function(e)
{
$("#app-status-ul").append('<li>backbutton event received</li>');
if( $("#home").length > 0)
{
// call this to get a new token each time. don't call it to reuse existing token.
//pushNotification.unregister(successHandler, errorHandler);
//e.preventDefault();
//navigator.app.exitApp();
}
else
{
//navigator.app.backHistory();
}
}, false);
*/
try
{
pushNotification = window.plugins.pushNotification;
if (device.platform == 'android' || device.platform == 'Android') {
$("#app-status-ul").append('<li>registering android</li>');
pushNotification.register(successHandler, errorHandler, {"senderID":"572963739426","ecb":"onNotificationGCM"});     // required!
} else {
$("#app-status-ul").append('<li>registering iOS</li>');
pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});    // required!
}
}
catch(err)
{
txt="There was an error on this page.\n\n";
txt+="Error description: " + err.message + "\n\n";
//alert(txt);
}
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
if (e.alert) {
$("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
//navigator.notification.alert(e.alert);
}

if (e.sound) {
var snd = new Media(e.sound);
snd.play();
}

if (e.badge) {
pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
}
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

switch( e.event )
{
case 'registered':
if ( e.regid.length > 0 )
{
$("#app-status-ul").append('<li>REGISTERED -> REGID:<a href="mailto:maitret@myhostmx.com?body=' + e.regid + '">' + e.regid + '</a></li>');
window.localStorage.setItem("token_push", e.regid);
// Your GCM push server needs to know the regID before it can push to this device
// here is where you might want to send it the regID for later use.
console.log("regID = " + e.regid);
}
break;

case 'message':
// if this flag is set, this notification happened while we were in the foreground.
// you might want to play a sound to get the user's attention, throw up a dialog, etc.
if (e.foreground)
{
$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

// if the notification contains a soundname, play it.
var my_media = new Media(e.soundname);
my_media.play();
}
else
{   // otherwise we were launched because the user touched a notification in the notification tray.
if (e.coldstart)
$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
else
$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
}

$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
break;

case 'error':
$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
break;

default:
$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
break;
}
}

function tokenHandler (result) {
$("#app-status-ul").append('<li>token: <a href="mailto:maitret@myhostmx.com?body=' + result + '">'+ result +'</a></li>');
window.localStorage.setItem("token_push", result);
// Your iOS push server needs to know the token before it can push to this device
// here is where you might want to send it the token for later use.
}

function successHandler (result) {
$("#app-status-ul").append('<li>success:'+ result +'</li>');
}

function errorHandler (error) {
$("#app-status-ul").append('<li>error:'+ error +'</li>');
}
document.addEventListener('deviceready', onDeviceReadyPush, true);

/*
if (navigator.geolocation) {
//navigator.geolocation.watchPosition(showPosition);
navigator.geolocation.getCurrentPosition(showPosition);
} else {
//alert("Geolicalizacion no soportada.");
}

function showPosition(position) {
var geo_info = "lat="+position.coords.latitude + "&lon="+ position.coords.longitude + "&alt="+ position.coords.altitude + "&pos_acc="+ position.coords.accuracy + "&pos_altacc="+ position.coords.altitudeAccuracy + "&pos_heading="+ position.coords.heading + "&pos_speed="+ position.coords.speed + "&pos_time="+ position.timestamp + "";
window.localStorage.setItem("User_Lat", position.coords.latitude);
window.localStorage.setItem("User_Lon", position.coords.longitude);
if(window.localStorage.getItem("geo_info_2") != geo_info) {
window.localStorage.setItem("geo_info_2", geo_info);
window.localStorage.setItem("geo_aprox", position.coords.accuracy);
//$('.De').val(position.coords.accuracy+" N: " +geo_info_2);
//$('.A').val("t:"+position.timestamp);
}
else {
// $('.De').val(position.coords.accuracy+" S: " +geo_info);
//$('.A').val("t:"+position.timestamp);
}
var d = new Date();
}
*/


if(typeof(device) !== "undefined") {
//localStorage.setItem("info_cliente", "&uuid="+device.uuid+"&platform="+device.platform+"&version="+device.version+"&model="+device.model+"&"+window.localStorage.getItem("geo_info_2")+"&token_push="+localStorage.getItem("token_push"));
} else {
//localStorage.setItem("info_cliente", "&"+window.localStorage.getItem("geo_info_2")+"");
}

/*
document.addEventListener("deviceready", GetDeviceInfo, false);
function GetDeviceInfo() {

} */

