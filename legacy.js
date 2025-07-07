// 此頁面會放上被降級/違規通關的關卡，而且不會登上新的成績。此列表順序不代表難度。
const ORDER = ["classical", "platformer"];

let local_data = {};
let levels = [];
$.getJSON("data.json", function(data) {
  local_data["classical"] = data;
});

$.getJSON("plat-data.json", function(data) {
  local_data["platformer"] = data;
})

$(document).ajaxStop(function() {
  // structure data
  for (let type of ORDER) {
    let player = local_data[type].player;
    let legacy = local_data[type].legacy;

    if (type == "classical") {
      var color = "--text-list-default";
    }
    else if (type == "platformer") {
      var color = "--text-platformer";
    }

    for (let level of legacy) {
      let lvl_name = level.level;
      // extract level name
      let deli_pos = lvl_name.indexOf("(");
      let is_2p = false;
      let multi_lvl = false;
      if (deli_pos != -1) {
        if (lvl_name.substring(deli_pos + 1, lvl_name.length - 1) != "2P") {
          multi_lvl = true;
        }
        else {
          is_2p = true;
        }
        lvl_name = lvl_name.substring(0, deli_pos);
      }
      //console.log(exd_arr[level]);

      let lvl = {
        name: lvl_name,
        id: level.id,
        publisher: level.publisher,
        is_2p: is_2p,
        multi_lvl: multi_lvl,
        color: color,
        completion: []
      }

      // check player completion
      for (let p in player) {
        if (lvl.id in player[p]) {
          let player_completion = {
            player: p,
            video: player[p][lvl.id].video,
            is_mobile: player[p][lvl.id].is_mobile,
            completion_date: player[p][lvl.id].completion_date
          }
          lvl.completion.push(player_completion);
        }
      }
      // sort completion
      lvl.completion.sort((a, b) => {
        var timeA = new Date(a.completion_date).getTime();
        var timeB = new Date(b.completion_date).getTime();
        if (timeA != timeB) {
          return timeA - timeB;
        }
        else {
          return ("" + a.player).localeCompare(b.player);
        }
      })

      levels.push(lvl);
    }
  }

  var str = "";
  let index = 0;
  for (let level of levels) {
    str += "<div class='leaderboard-btn";
    if (index == 0) {
      str += " selected";
    }
    str += "' data-id='" + index + "'>\
              <h3 style='padding-left: 15px;'>";

    if (level.is_2p) {
      str += "  <span style='color: var(--text-note); float: left; font-weight: normal'>\
                  [2P]&nbsp&nbsp\
                </span>";
    }

    str += "    <span style='color: var(" + level.color + "); float: left'>" + level.name + "</span>";

    if (level.multi_lvl) {
      str += "<span style='color: var(--text-note); float: left; font-weight: normal'>\
                &nbsp&nbsp(" + level.publisher + ")\
              </span>";
    }

    str += "  </h3>\
            </div>";
    index++;
  }
  $("#player").html(str);

  str = "";
  index = 0;
  for (let level of levels) {
    str += "<div class='leaderboard-btn' data-id='" + index + "'>\
              <h3>";

    if (level.is_2p) {
      str += "  <span style='color: var(--text-note); float: left; font-weight: normal'>\
                  [2P]&nbsp&nbsp\
                </span>";
    }

    str += "    <span style='color: var(" + level.color + "); float: left'>" + level.name + "</span>";

    if (level.multi_lvl) {
      str += "<span style='color: var(--text-note); float: left; font-weight: normal'>\
                &nbsp&nbsp(" + level.publisher + ")\
              </span>";
    }

    str += "  </h3>\
            </div>\
            <div style='width: 95%; border-bottom: solid 2px var(--list-border); margin: 5px auto;'></div>";
    index++;
  }
  $("#mobile-player").html(str);

  // load details
  loadDetails(0);

  $(".selected").css("background-color", setColorOpacity($(":root").css("--list-selected"), 0.16));

  // show list
  $(".loaderContainer").css("display", "none");
  $(".content").css("opacity", "100%").css("top", "0");
  $(".addr").css("opacity", "100%");
})

$("#player").on("click", ".leaderboard-btn", function() {
  if (!$(this).hasClass("selected")) {
    $(".selected").css("background-color", setColorOpacity($(":root").css("--list-selected"), 0))
      .removeClass("selected");
    $(this).addClass("selected");
    let col_str = $(this).css("background-color");
    $(this).css("background-color", setColorOpacity(col_str, 0.16));

    $("#player-detail").scrollTop(0);
    loadDetails(+$(this).attr("data-id"));
  }
});

// popup modal
$("#mobile-player").on("click", ".leaderboard-btn", function() {
  $(".selected").css("background-color", setColorOpacity($(":root").css("--list-selected"), 0))
    .removeClass("selected");
  $("#player .leaderboard-btn[data-id='" + $(this).attr("data-id") + "']")
    .css("background-color", setColorOpacity($(":root").css("--list-selected"), 0.16))
    .addClass("selected");
  loadDetails(+$(this).attr("data-id"));

  $("#mobile-detail").scrollTop(0);

  // display detail
  $("#mobile-detail-container")
    .css("height", "100%")
    .css("opacity", "1");
  
  $("#mobile-modal")
    .css("top", "20px");

  // disable leaderboard scroll
  $("html")
    .css("overflow", "hidden");
});

// close modal
$(document).on("click", function(event) {
  if (!$(event.target).parents("#mobile-detail-container").length && $("#mobile-detail-container").css("opacity") != "0" && !$(event.target).parents("#darkmode-switch-container").length) {
    $("#mobile-detail-container")
      .css("height", "0")
      .css("opacity", "0");
    
    $("#mobile-modal")
      .css("top", "40px");

    $("html")
      .css("overflow", "auto");
  }
});

$(window).on("resize", function() {
    $("#mobile-detail-container")
      .css("height", "0")
      .css("opacity", "0");
    
    $("#mobile-modal")
      .css("top", "40px");

    $("html")
      .css("overflow", "auto");
});

$("#player, #mobile-player").on("mouseenter", ".leaderboard-btn:not(.selected)", function() {
  $(this).css("background-color", setColorOpacity($(":root").css("--list-selected"), 0.05));
}).on("mouseleave", ".leaderboard-btn:not(.selected)", function() {
  $(this).css("background-color", setColorOpacity($(":root").css("--list-selected"), 0));
});

$("#modal-close").on("click", function() {
  $("#mobile-detail-container")
      .css("height", "0")
      .css("opacity", "0");
    
    $("#mobile-modal")
      .css("top", "40px");

    $("html")
      .css("overflow", "auto");
});


//list the players of the demon
function listPlayers(players) {
  // convert to HTML
  let str = "";
  for (let p in players) {
    let player = players[p];
    str += "<div style='height: 30px; width: 98%; line-height: 30px; font-size: 20px; margin: 10px 0;'>\
              <span class='lvl-tag' style='width: 30px; height: 30px; float: left;'>";
    if (player.is_mobile) {
      str += "<img src='img/mobile.png' height='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>"
    }
    str +=   "</span>\
              <span class='lvl-place' style='float: left; width: 40px; text-align: center; margin-right: 20px;'>\
                #" + (+p + 1) + "\
              </span>\
              <span class='lvl-name'>";
    str += player.player + "&nbsp&nbsp\
              </span>\
              <span class='lvl-link link' style='float: right; width: 30px; height: 30px;'>";
    // video
    if (player.video != " ") {
      if (player.video.includes("facebook.com") || player.video.includes("fb.watch")) {
        var img = "fb.png";
      }
      else if (player.video.includes("youtube.com")) {
        var img = "yt.png";
      }
      else {
        var img = "link.png";
      }
      str += "<a class='link' href=" + player.video + ">\
                <img src='img/" + img + "' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>\
              </a>";
    }
    else {
      str += "<img src='img/broken.png' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>";
    }
    str += "  </span>";
    if (player.video != " ") {
      str += "<span class='lvl-date' style='float: right; height: 30px; margin-right: 20px; font-size: 15px;'>" + 
                formatDate(player.completion_date) +
              "</span>";
    }
    str += "</div>";
  }
  return str;
}

function loadDetails(dID) {
  let lvl = levels[dID];

  let str = "";
  str += "<div style='margin: 30px 0 5px 40px; height: 50px; width: 90%;'>\
            <h1 style='float: left; color: var(" + lvl.color + "); max-width: 400px; height: 50px; line-height: 50px; margin: 0'>" + 
              ((lvl.is_2p) ? "<span style='font-weight: normal; color: var(--text-note);'>[2P]&nbsp&nbsp</span>" : "") +
              lvl.name + 
            "</h1>\
          </div>\
          <div style='font-size: 18px; margin: 0 0 30px 40px;'>\
            <i>by &nbsp"+ lvl.publisher + "</i>\
          </div>\
          <div id='player-info_mobile' style='margin-left: 40px; width: 30%; grid-template-columns: [c1] 1fr [c2]; grid-template-rows: [r1] 1fr [r2];'>\
            <span class='title' style='grid-column: 1/2; grid-row: 1/2'>\
              關卡ID\
            </span>\
            <span class='leaderboard-detail-content' style='grid-column: 1/2; grid-row: 2/3'>" +
              lvl.id  +
            "</span>\
          </div>\
          <div style='margin: 30px 0 20px 40px; width: 98%; height: 35px;'>\
            <h2 style='margin: 0; width: 150px; float: left;'>\
              通關玩家\
            </h2>\
          </div>\
          <div id='player-level-list'>" + listPlayers(lvl.completion) + "</div>";
  $("#player-detail").html(str);

  str = "";
  str += "<div style='margin: 0 0 0 10px; height: 50px; width: 90%;'>\
            <h1 style='float: left; color: var(" + lvl.color + "); max-width: 400px; height: 50px; line-height: 50px; margin: 0'>" + 
              ((lvl.is_2p) ? "<span style='font-weight: normal; color: var(--text-note);'>[2P]&nbsp&nbsp</span>" : "") +
              lvl.name + 
            "</h1>\
          </div>\
          <div style='font-size: 14px; margin: 0 0 30px 10px;'>\
            <i>by &nbsp"+ lvl.publisher + "</i>\
          </div>\
          <div id='player-info_mobile' style='margin-left: 40px; width: 30%; grid-template-columns: [c1] 1fr [c2]; grid-template-rows: [r1] 1fr [r2];'>\
            <span class='title' style='grid-column: 1/2; grid-row: 1/2'>\
              關卡ID\
            </span>\
            <span class='leaderboard-detail-content' style='grid-column: 1/2; grid-row: 2/3'>" + 
              lvl.id +
            "</span>\
          </div>\
          <div id='mobile-level-list-title' style='margin: 30px 0 20px 40px; width: 98%; height: 35px;'>\
            <h2 style='margin: 0; width: 150px; float: left;'>\
              通關玩家\
            </h2>\
          </div>\
          <div id='player-level-list_mobile'>" + listPlayers(lvl.completion) + "</div>";
  $("#mobile-detail").html(str);
}

// compute score
function FORMULA(n, length) {
  var N = (150 - 1) / (length - 1) * (n - 1) + 1;
  return Math.round(100 * 1.0881 * (250 / (0.125 * (N + 7))) * (Math.log(0.125 * (N + 7)) + 1) / Math.pow(1.0881, Math.pow(N, 0.6))) / 100;
}

function setColorOpacity(colorStr, opacity) {
  if(colorStr.indexOf("rgb(") == 0)
  {
    var rgbaCol = colorStr.replace("rgb(", "rgba(");
    rgbaCol = rgbaCol.replace(")", ", "+opacity+")");
    return rgbaCol;
  }

  if(colorStr.indexOf("rgba(") == 0)
  {
    var rgbaCol = colorStr.substr(0, colorStr.lastIndexOf(",")+1) + opacity + ")";
    return rgbaCol;
  }

  if(colorStr.length == 6)
    colorStr = "#" + colorStr;

  if(colorStr.indexOf("#") == 0)
  {
    var rgbaCol = 'rgba(' + parseInt(colorStr.slice(-6, -4), 16)
        + ',' + parseInt(colorStr.slice(-4, -2), 16)
        + ',' + parseInt(colorStr.slice(-2), 16)
        + ','+opacity+')';
    return rgbaCol;
  }
  return colorStr;
}

function formatDate(dateStr) {
  let first_deli = dateStr.indexOf("-");
  let second_deli = dateStr.lastIndexOf("-");
  return dateStr.substring(0, first_deli) + "/" + dateStr.substring(first_deli + 1, second_deli) + "/" + dateStr.substring(second_deli + 1);
}