var counter = 0;
var LIMIT = 100; // to prevent browsers from infinitely displaying log and hogging memory
var DEBUG = false;
var SCROLL = true;
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
        log_line += "<div class='row'><span class='hostname'>" + inner_payload.syslog_hostname + " </span>";
        log_line += "<span class='timestamp'>" + inner_payload.syslog_timestamp + " </span>";
        log_line += inner_payload.syslog_message;
        log_line += "</div>";
        if(counter++>LIMIT) {
            $("#log").children("div:first").remove();
        }
        log.append(log_line);
        if(SCROLL) {
            $(window).scrollTop($("#footer").offset().top);
        }
        if(DEBUG) {
            console.log(payload);
            console.log(inner_payload);
        }
    }
});

$(".toggle-scroll").click(function() {
    SCROLL = !SCROLL;
});
