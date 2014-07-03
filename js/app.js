// Creates an array that deletes older items (circular queue)
function CappedArray(n) {
    this._array = new Array;
    this.maxlength = n;
}

CappedArray.prototype.add = function(x) {
    this._array.push(x);
    if(this._array.length == this.maxlength) {
        this._array.shift();
    }
}

var container = new CappedArray(10);
var DEBUG = false;
$(document).ready(function() {
    var ws = new WebSocket("ws://23.253.228.216:3232");
    var log = $("#log");
    var state = $("#state");
    ws.onopen = function(event) {
        log.append("WebSocket Connected. Streaming logs..<br/>");
        state.html("Connected");
    }
    ws.onclose = function(event) {
        log.append("WebSocket Errored out. " +  event);
        state.html("Error");
    }
    ws.onerror = ws.onclose;
    ws.onmessage = function (event) {
        var payload = JSON.parse(event.data.replace(/=>/g,":"));
        var inner_payload = JSON.parse(payload.message);
        var log_line = '';
        log_line += "<span class='hostname'>" + inner_payload.syslog_hostname + " </span>";
        log_line += "<span class='timestamp'>" + inner_payload.syslog_timestamp + " </span>";
        log_line += inner_payload.syslog_message;
        log_line += "</br>";
        log.append(log_line);
        container.add(log_line);
        $(window).scrollTop($("#footer").offset().top);
        if(DEBUG) {
            console.log(payload);
            console.log(inner_payload);
        }
    }
});

