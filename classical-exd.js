var file = "data.json";
var site = "https://api.aredl.net/api/aredl/levels/";

var exd_arr = [];
var local_data;
$.getJSON(file, function(data) {
  local_data = data;
  for (let n = 0; n < data.demon.length; n++) {
    $.ajax({
      url: site + data.demon[n][1],
      type: "GET",
      success: function(lvl) {
        exd_arr.push(lvl);
      }
    })
  }
});

$(document).ajaxStop(function() {
  // sort by placement
  exd_arr.sort((a, b) => a.position - b.position);

  var str = "";
  for (var n in exd_arr) {
    // color
    if (+exd_arr[n].position <= 15) {
      var color = "--text-list-top";
    }
    else if (+exd_arr[n].position <= 75) {
      var color = "--text-list-main";
    }
    else if (+exd_arr[n].position <= 150) {
      var color = "--text-list-extended";
    }
    else {
      var color = "--text-list-default";
    }

    // level name
    if (exd_arr[n].name.includes("(")) {
      var exd_name = exd_arr[n].name.split("(")[0];
      exd_name = exd_name.substring(0, exd_name.length - 1);
    }
    else {
      var exd_name = exd_arr[n].name;
    }
    str += "<button class='dropdownBtn'><h2>\
            <i style='color: var(" + color + ")'>\
              #" + (+n + 1) + " " + exd_name + "</i>\
            <i style='font-weight: normal'> by " + exd_arr[n].publisher.global_name + " </i>\
            <span style='font-size: 15px; font-weight: normal'>\
              &nbsp (" + FORMULA(+n + 1, local_data.demon.length).toFixed(2) + " pts)\
            </span>\
            <span class='indicator' style='float: right'>+</span></h2></button>\
            <div class='collapseWrap'>\
              <div class='collapsable'>"+ 
                listPlayer(local_data.player, exd_arr[n].level_id) + 
              "</div>\
            </div>";
  }
  $("#exd").html(str);

  // show list
  $(".loaderContainer").css("display", "none");
  $(".content").css("opacity", "100%").css("top", "0");
  $(".addr").css("opacity", "100%");
});

// dropdown
$("#exd").on("click", ".dropdownBtn", function() {
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
      str += "<span style='color: var(--text-removal)'>Video Lost</span>"
    }
    if (p.detail.is_mobile) {
      str += ' <i style="margin-left: 5px">"Mobile"</i>'
    }
    str += "</h5>";
  }
  return str;
}

// compute score
function FORMULA(n, length) {
  var N = (150 - 1) / (length - 1) * (n - 1) + 1;
  return Math.round(100 * 1.0881 * (250 / (0.125 * (N + 7))) * (Math.log(0.125 * (N + 7)) + 1) / Math.pow(1.0881, Math.pow(N, 0.6))) / 100;
}