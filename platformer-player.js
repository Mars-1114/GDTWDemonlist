var file = "plat-data.json";
var site = "https://corsproxy.io/?url=https://pemonlist.com/api/list?limit=150";

var local_data;
var pemonlist_arr = [];
var exd_arr = [];
$.getJSON(file, function(data) {
  local_data = data;
  // fetch pemonlist
  $.ajax({
      url: site,
      method: "GET",
      success: function(pemonlist) {
        pemonlist_arr = pemonlist.data;
      },
      error: function(xhr) {
        let status = xhr.status;
        // use backup file
        $.getJSON("pemonlist-backup.json", function(backup) {
          pemonlist_arr = backup.data;
          // client error
          if (status >= 400 && status < 500) {
            var msg = "您的IP可能被此網站使用的<a class='link' href='https://github.com/aszx87410/blog/issues/69'>代理伺服器</a>封鎖或拒絕存取，";
          }
          // server error
          else if (status >= 500) {
            var msg = "由於Pemonlist目前斷線中，";
          }
          msg += "因此目前會使用備份資料展示列表 (備份日期：" + backup.backup_date + ")";
          $("#warning").html(msg).css("margin-bottom", "15px");
        });
      }
  });
});

$(document).ajaxStop(function() {
  // find demons
  let legacy = local_data.legacy;
  for (let exd of local_data.demon) {
    let target = pemonlist_arr.find(x => +x.level_id == +exd[1]);
    if (target !== undefined && legacy.find(x => +x.id == +exd[1]) === undefined) {
      exd_arr.push(target);
    }
  }

  exd_arr.sort((a, b) => a.placement - b.placement);
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
          placement: exd_arr[id].placement,
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
                <span style=\"color: #86d9f0\">" + player.player + "</span>\
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
    if (+demons[n].placement <= 15) {
      var color = "rgb(195, 77, 77)";
    }
    else if (+demons[n].placement <= 75) {
      var color = "rgb(223, 193, 125)";
    }
    else if (+demons[n].placement <= 150) {
      var color = "rgb(24, 186, 32)";
    }
    else {
      var color = "rgb(255, 255, 255)";
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
              <span style='color: " + color + "'>\
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
      str += "<span style='color: rgb(235, 110, 101)'>Video Lost</span>";
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