var file = "data.json";
var site = "https://api.aredl.net/v2/api/aredl/levels";

var local_data;
var exd_arr = [];
$.getJSON(file, function(data) {
  local_data = data;
  $.ajax({
    url: site,
    type: "GET",
    success: function(data) {
      let all_exd_arr = data;
  
      for (let lvl of local_data.demon) {
        let exd = all_exd_arr.find(x => +x.level_id == +lvl[1])
        if (exd !== undefined && !exd.legacy) {
          exd_arr.push(exd);
        }
      }
      exd_arr.sort((a, b) => a.position - b.position);
    }
  })
});

$(document).ajaxStop(function() {
  // structure data
  var players = [];
  for (let player in local_data.player) {
    let player_completion = {
      player: player,
      levels: [],
      points: 0
    };

    for (var level in local_data.player[player]) {
      let id = exd_arr.findIndex(x => +x.level_id == +level);
      if (id != -1) {
        let level_data = {
          level: exd_arr[id].name,
          placement: exd_arr[id].position,
          video: local_data.player[player][level].video,
          date: local_data.player[player][level].completion_date,
          is_mobile: local_data.player[player][level].is_mobile
        }
        player_completion.points += FORMULA(id + 1, exd_arr.length);
        player_completion.levels.push(level_data);
      }
    }

    player_completion.levels.sort((a, b) => a.placement - b.placement);
    players.push(player_completion);
  }

  // sort players (according to rule 三.2.i)
  players.sort(function(a, b) {
    // a. POINTS
    if (a.points != b.points) {
      return b.points - a.points;
    }
    // b. HARDEST PLACEMENT
    else if (a.levels[0].placement != b.levels[0].placement) {
      return a.levels[0].placement - b.levels[0].placement;
    }
    // c. DEMONS COUNT
    else if (a.levels.length != b.levels.length) {
      return b.levels.length - a.levels.length;
    }
    else {
      // d. HARDEST VIDEO UPLOAD TIME
      let aDate = new Date(a.levels[0].date).getTime();
      let bDate = new Date(b.levels[0].date).getTime();
      if (aDate != bDate) {
        return aDate - bDate;
      }
      // e. PLAYER NAME
      else {
        return ("" + a.player).localeCompare(b.player);
      }
    }
  })
  console.log(players);

  var str = "";
  for (let player of players) {
    str += "<button class=\"dropdownBtn\">\
              <h2>\
                <span style=\"color: var(--text-list-default)\">" + player.player + "</span>\
                <span style='font-size: 0.8em'> \
                  (" + player.points.toFixed(2) + " pts)\
                </span>\
                <span class='indicator' style='float: right'>+</span>\
              </h2>\
            </button>\
            <div class='collapseWrap'>\
              <div class='collapsable'>" + listDemons(player.levels) + "</div>\
            </div>";
  }
  $("#player").html(str);

  // show list
  $(".loaderContainer").css("display", "none");
  $(".content").css("opacity", "100%").css("top", "0");
  $(".addr").css("opacity", "100%");
})

// dropdown
$("#player").on("click", ".dropdownBtn", function() {
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

//list the demons of the player
function listDemons(demons) {
  // convert to HTML
  let str = "";
  for (let n in demons) {
    // color
    if (+demons[n].placement <= 25) {
      var color = "--text-list-top";
    }
    else if (+demons[n].placement <= 75) {
      var color = "--text-list-main";
    }
    else if (+demons[n].placement <= 150) {
      var color = "--text-list-extended";
    }
    else {
      var color = "--text-default";
    }

    // level name
    if (demons[n].level.includes("(")) {
      var exd_name = demons[n].level.split("(")[0];
      exd_name = exd_name.substring(0, exd_name.length - 1);
    }
    else {
      var exd_name = demons[n].level;
    }

    str += "<h5>\
              <span style='color: var(" + color + ")'>\
                #" + (+n + 1) + " " + exd_name +
              "</span> | ";
    if (demons[n].video != " ") {
      // video site
      if (demons[n].video.includes("facebook.com") || demons[n].video.includes("fb.watch")) {
        var site = "Facebook";
      }
      else if (demons[n].video.includes("youtube.com")) {
        var site = "YouTube";
      }
      else {
        var site = "link";
      }
      str += "<a class='link' href=" + demons[n].video + " style='font-weight: normal'>" + site + "</a>";
    }
    else {
      str += "<span style='color: var(--text-removal)'>Video Lost</span>";
    }
    // mobile
    if (demons[n].is_mobile) {
      str += ' <i style="margin-left: 5px">"Mobile"</i>'
    }
  }
  return str;
}

// compute score
function FORMULA(n, length) {
  var N = (150 - 1) / (length - 1) * (n - 1) + 1;
  return Math.round(100 * 1.0881 * (250 / (0.125 * (N + 7))) * (Math.log(0.125 * (N + 7)) + 1) / Math.pow(1.0881, Math.pow(N, 0.6))) / 100;
}