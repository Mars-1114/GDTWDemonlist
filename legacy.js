var local_data = {};
$.getJSON("data.json", function(data) {
  local_data["classical"] = data;
});

$.getJSON("plat-data.json", function(data) {
  local_data["platformer"] = data;
})

$(document).ajaxStop(function() {
  // html
  let str = "";
  for (let type in local_data) {
    var player = local_data[type].player;
    var legacy = local_data[type].legacy;
    if (type == "classical") {
      var color = "#86d9f0";
    }
    else if (type == "platformer") {
      var color = "#a27dff";
    }

    for (let lvl of legacy) {
      str += "<button class='dropdownBtn'>\
                <h2>\
                  <i style='color:" + color + "'>" + lvl.level + "</i>\
                  <i style='font-weight: normal'> by " + lvl.publisher + "</i>\
                  <span class='indicator' style='float: right'>+</span>\
                </h2>\
              </button>\
              <div class='collapseWrap'>\
                <div class='collapsable'>" + listPlayer(player, lvl.id) + "</div>\
              </div>";
    }
  }
  $("#legacy").html(str);

  // show list
  $(".loaderContainer").css("display", "none");
  $(".content").css("opacity", "100%").css("top", "0");
  $(".addr").css("opacity", "100%");
})

// dropdown
$("#legacy").on("click", ".dropdownBtn", function() {
  $(this).toggleClass("active");
  let dropdown = $(this).next();
  if ($(this).hasClass("active")) {
    $(this).find(".indicator").html("-");
    dropdown.css("height", dropdown[0].scrollHeight);
  }
  else {
    $(this).find(".indicator").html("+");
    dropdown.css("height", "0");
  }
});

//data process
function listPlayer(player, id) {
  //list the player
  let arr = [];
  for (let i in player) {
    if (id in player[i]) {
      arr.push({
        player: i,
        detail: player[i][id]
      });
    }
  }
  arr.sort(function(a, b) {
    var timeA = new Date(a.detail.completion_date).getTime()
    var timeB = new Date(b.detail.completion_date).getTime();
    if (timeA != timeB) {
      return timeA - timeB;
    }
    else {
      return ("" + a.player).localeCompare(b.player);
    }
  });

  //convert to HTML
  let str = "";
  for (let p of arr) {
    str += "<h5>" + p.player + " - ";
    if (p.detail.video != " ") {
      // video site
      if (p.detail.video.includes("facebook.com") || p.detail.video.includes("fb.watch")) {
        var site = "Facebook";
      }
      else if (p.detail.video.includes("youtube.com")) {
        var site = "YouTube";
      }
      else {
        var site = "link";
      }
      str += "<a class='link' href='" + p.detail.video + "' style='font-weight: normal'>" + site + "</a>";
    }
    else {
      str += "<span style='color: rgb(235, 110, 101)'>Video Lost</span>"
    }
    if (p.detail.is_mobile) {
      str += ' <i style="margin-left: 5px">"Mobile"</i>'
    }
    str += "</h5>";
  }
  return str;
}
