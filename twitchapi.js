var streamers = ["nocopyrightsounds", "freecodecamp", "esl_sc2", "ogamingSC2", "cretetion", "storbeck", "habathcx", "robotcaleb", "noobs2ninjas"];
var apiUrl = "https://wind-bow.glitch.me/twitch-api/";
var currentTab = "all";

//only add online streamers to #results
function onlineOnly(data) {
    if (data["stream"]) {
        var name = data["_links"]["channel"].replace("https://api.twitch.tv/kraken/channels/", "");
        $("#results").append(createElement(name, "online"));
    }
}

//only add offline streamers to #results
function offlineOnly(data) {
    if (data["stream"] === null) {
        var name = data["_links"]["channel"].replace("https://api.twitch.tv/kraken/channels/", "");
        $("#results").append(createElement(name, "offline"));
    }
}

//returns a json object from api
function getStream(name, option="all") {
    var streamUrl = apiUrl + "streams/" + name;
    $.ajax({
        dataType: "json",
        url: streamUrl,
        success: function(data) {
            if (option === "online") {
                onlineOnly(data)
            }
            else if (option === "offline") {
                offlineOnly(data);
            }
            else {
                addStream(data);
            }
        },
        cache: false
    });
} 

//create html element
function createElement(name, status) {
    var element = '<div class="channels"><h2>' + name + '</h2>';
    if (status === "online") {
        element += '<p style="color:green">Online</p><a href="https://twitch.tv/' + name;
        element += '" target="_blank" class="btn btn-primary">Link to Stream</a></div>';
    }
    else {
        element += '<p style="color:red">Offline</p><a href="https://twitch.tv/' + name;
        element += '" target="_blank" class="btn btn-primary">Link to Channel</a></div>';
    }
    return element;
}

//add twitch api json to #results
function addStream(data) {
    var name = data["_links"]["channel"].replace("https://api.twitch.tv/kraken/channels/", "");
    var element = "";
    if (data["stream"] === null) {
        element = createElement(name, "offline");
    }
    else {
        element = createElement(name, "online");
    }
    $("#results").append(element);
} 

//display all streamers
function allStreamers() {
    $("#results").html("")
    for (var i = 0; i < streamers.length; i++) {
        getStream(streamers[i]);
    }
}

//display all online
function onlineStreamers() {
    $("#results").html("")
    for (var i = 0; i < streamers.length; i++) {
        getStream(streamers[i], "online");
    }
}

//display all offline
function offlineStreamers() {
    $("#results").html("")
    for (var i = 0; i < streamers.length; i++) {
        getStream(streamers[i], "offline");
    }
}

//search through streamers array
function searchStreamers(input) {
    for (var i = 0; i < streamers.length; i++) {
        if(streamers[i].toLowerCase().includes(input)) {
            getStream(streamers[i], currentTab);
        }
    }
}

//display results based on input
function search(input) {
    input = input.replace(" ", "").toLowerCase();
    $("#results").html("");
    if (input === "") {
        switch(currentTab) {
            case "all":
                allStreamers();
                break;
            case "online":
                onlineStreamers();
                break;
            case "offline":
                offlineStreamers();
                break;
        }
    }
    else if (streamers.includes(input)) {
        getStream(input, currentTab);
    }
    else {
        searchStreamers(input);
    }
}

$(document).ready(function() {
    allStreamers();
    $("#all").css("background-color", "rgb(0,0,0)");

    $("#all").on("click", function() {
        $("#all").css("background-color", "rgb(0,0,0)");
        $("#online").css("background-color", "rgb(225,255,255)");
        $("#offline").css("background-color", "rgb(255,255,255)");
        currentTab = "all";
        allStreamers();
    });

    $("#online").on("click", function() {
        $("#online").css("background-color", "rgb(0,0,0)");
        $("#all").css("background-color", "rgb(225,255,255)");
        $("#offline").css("background-color", "rgb(255,255,255)");
        currentTab = "online";
        onlineStreamers();
    });

    $("#offline").on("click", function() {
        $("#offline").css("background-color", "rgb(0,0,0)");
        $("#online").css("background-color", "rgb(225,255,255)");
        $("#all").css("background-color", "rgb(255,255,255)");
        currentTab = "offline";
        offlineStreamers();
    });

    $("#input").on("keyup", function() {
        search($("#input").val());
    });
});