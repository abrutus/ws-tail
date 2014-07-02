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
        console.log(payload);
        var inner_payload = JSON.parse(payload.message);
        log.append("<span class='hostname'>" + inner_payload.syslog_hostname + " </span>");
        log.append("<span class='timestamp'>" + inner_payload.syslog_timestamp + " </span>");
        log.append(inner_payload.syslog_message);
        log.append("</br>");
        console.log(inner_payload);
    }
});
