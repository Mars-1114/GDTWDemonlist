let file = "data.json";
let contact_file = "player-contact.json";
let site = "https://api.aredl.net/v2/api/aredl/levels";

let local_data;
let contact;
let exd_arr = [];
let players = [];

let orderBy = "diff";
let placement = "GDTW";

$.getJSON(file, function(data) {
  local_data = data;
  $.ajax({
    url: site,
    type: "GET",
    success: function(data) {
      let all_exd_arr = data;
  
      for (let lvl of local_data.demon) {
        // check 2p
        let exd;
        if (lvl[1].includes("_2p")) {
          lvl[1] = lvl[1].substring(0, lvl[1].length - 3);
          exd = all_exd_arr.find(x => +x.level_id == +lvl[1] && x.two_player);
        }
        else {
          exd = all_exd_arr.find(x => +x.level_id == +lvl[1] && !x.two_player);
        }
        //console.log(exd)
        if (exd !== undefined && !exd.legacy) {
          exd_arr.push(exd);
        }
      }
      exd_arr.sort((a, b) => a.position - b.position);
    }
  })
});

$.getJSON(contact_file, function(data) {
  contact = data;
})

$(document).ajaxStop(function() {
  // structure data
  for (let player in local_data.player) {
    let player_completion = {
      player: player,
      levels: [],
      points: 0,
      contact: contact[player]
    };

    for (var level in local_data.player[player]) {
      let id;
      if (level.includes("_2p")) {
        let lvl_id = level.substring(0, level.length - 3);
        id = exd_arr.findIndex(x => +x.level_id == +lvl_id && x.two_player);
      }
      else {
        id = exd_arr.findIndex(x => +x.level_id == +level && !x.two_player);
      }
      if (id != -1) {
        let level_data = {
          level: exd_arr[id].name,
          placement: exd_arr[id].position,
          gdtw_placement: id + 1,
          is_2p: exd_arr[id].two_player,
          video: local_data.player[player][level].video,
          date: local_data.player[player][level].completion_date,
          is_mobile: local_data.player[player][level].is_mobile,
          pts: FORMULA(+id + 1, +exd_arr[id].position, exd_arr.length),
        }
        player_completion.points += level_data.pts,
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
  //console.log(players);

  let place = 1;
  var str = "";
  for (let player of players) {
    str += "<div class='leaderboard-btn";
    if (place == 1) {
      str += " selected";
    }
    str += "' data-id='" + place + "'>\
              <h3>\
                <span style='width: 40px; color: var(--text-list-default); float: left; text-align: right; padding-right: 20px;'>\
                  #" + place + "\
                </span>\
                <span style='color: var(--text-list-default); float: left; overflow: hidden; width: 220px; height: 30px;'>" + player.player + "</span>\
                <span style='display: block; text-align: right; font-size: 0.9em'>" +
                  player.points.toFixed(2) + " pts\
                </span>\
              </h3>\
            </div>";
    place++;
  }
  $("#player").html(str);

  // mobile
  place = 1;
  str = "";
  for (let player of players) {
    str += "<div class='leaderboard-btn' data-id='" + place + "'>\
              <h3>\
                <span style='width: 40px; color: var(--text-list-default); float: left; text-align: right; padding-right: 20px;'>\
                  #" + place + "\
                </span>\
                <span style='color: var(--text-list-default); float: left; overflow: hidden; width: 220px; height: 30px;'>" + player.player + "</span>\
                <span style='display: block; text-align: right; font-size: 0.9em'>" +
                  player.points.toFixed(2) + " pts\
                </span>\
              </h3>\
            </div>\
            <div style='width: 95%; border-bottom: solid 2px var(--list-border); margin: 5px auto;'></div>";
    place++;
  }
  $("#mobile-player").html(str);

  // load details
  loadDetails(1);

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

    // change switch button
    if ($(window).width() <= 730) {
      if (orderBy == "diff") {
        $("#order-switch_mobile").css("top", "-15px");
      }
      else {
        $("#order-switch_mobile").css("top", "-55px");
      }
      if (placement == "GDTW") {
        $("#placement-switch_mobile").css("top", "-12px");
      }
      else {
        $("#placement-switch_mobile").css("top", "-52px");
      }
    }
    else {
      if (orderBy == "diff") {
        $("#order-switch_mobile").css("top", "-17px");
      }
      else {
        $("#order-switch_mobile").css("top", "-57px");
      }
      if (placement == "GDTW") {
        $("#placement-switch_mobile").css("top", "-15px");
      }
      else {
        $("#placement-switch_mobile").css("top", "-55px");
      }
    }
});

$("#player, #mobile-player").on("mouseenter", ".leaderboard-btn:not(.selected)", function() {
  $(this).css("background-color", setColorOpacity($(":root").css("--list-selected"), 0.05));
}).on("mouseleave", ".leaderboard-btn:not(.selected)", function() {
  $(this).css("background-color", setColorOpacity($(":root").css("--list-selected"), 0));
});

$("#player-detail").on("click", "#order-switch-display input", function() {
  let playerID = +$(".selected").attr("data-id") - 1;
  if (orderBy == "diff") {
    $("#order-switch").css("top", "-57px");
    orderBy = "alphabet";
  }
  else {
    $("#order-switch").css("top", "-17px");
    orderBy = "diff";
  }
  $("#player-level-list").html(listDemons(players[playerID].levels));
});

$("#player-detail").on("click", "#placement-switch-display input", function() {
  let playerID = +$(".selected").attr("data-id") - 1;
  if (placement == "GDTW") {
    $("#placement-switch").css("top", "-55px");
    placement = "ARDEL";
  }
  else {
    $("#placement-switch").css("top", "-15px");
    placement = "GDTW";
  }
  $("#player-level-list").html(listDemons(players[playerID].levels));
});

$("#mobile-detail").on("click", "#order-switch-display_mobile input", function() {
  let playerID = +$(".selected").attr("data-id") - 1;
  if ($(window).width() <= 730) {
    if (orderBy == "diff") {
      $("#order-switch").css("top", "-57px");
      $("#order-switch_mobile").css("top", "-55px");
      orderBy = "alphabet";
    }
    else {
      $("#order-switch").css("top", "-17px");
      $("#order-switch_mobile").css("top", "-15px");
      orderBy = "diff"; 
    }
  }
  else {
    if (orderBy == "diff") {
      $("#order-switch").css("top", "-57px");
      $("#order-switch_mobile").css("top", "-57px");
      orderBy = "alphabet";
    }
    else {
      $("#order-switch").css("top", "-17px");
      $("#order-switch_mobile").css("top", "-17px");
      orderBy = "diff"; 
    }
  }
  $("#player-level-list").html(listDemons(players[playerID].levels));
  $("#player-level-list_mobile").html(listDemons(players[playerID].levels));
});

$("#mobile-detail").on("click", "#placement-switch-display_mobile input", function() {
  let playerID = +$(".selected").attr("data-id") - 1;
  if ($(window).width() <= 730) {
    if (placement == "GDTW") {
      $("#placement-switch").css("top", "-55px");
      $("#placement-switch_mobile").css("top", "-52px");
      placement = "AREDL";
    }
    else {
      $("#placement-switch").css("top", "-15px");
      $("#placement-switch_mobile").css("top", "-12px");
      placement = "GDTW";
    }
  }
  else {
    if (placement == "GDTW") {
      $("#placement-switch").css("top", "-55px");
      $("#placement-switch_mobile").css("top", "-55px");
      placement = "AREDL";
    }
    else {
      $("#placement-switch").css("top", "-15px");
      $("#placement-switch_mobile").css("top", "-15px");
      placement = "GDTW";
    }
  }
  $("#player-level-list").html(listDemons(players[playerID].levels));
  $("#player-level-list_mobile").html(listDemons(players[playerID].levels));
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


//list the demons of the player
function listDemons(demons) {
  let demons_copy = structuredClone(demons);
  // convert to HTML
  let str = "";
  if (orderBy == "alphabet") {
    demons_copy.sort(function(a, b) {
        return ("" + a.level).localeCompare(b.level);
    })
  }
  for (let n in demons_copy) {
    // color
    if (+demons_copy[n].placement <= 50) {
      var color = "--text-list-top";
    }
    else if (+demons_copy[n].placement <= 75) {
      var color = "--text-list-main";
    }
    else if (+demons_copy[n].placement <= 150) {
      var color = "--text-list-extended";
    }
    else {
      var color = "--text-default";
    }

    // level name
    if (demons_copy[n].level.includes("(")) {
      var exd_name = demons_copy[n].level.split("(")[0];
      var exd_publisher = demons_copy[n].level.split("(")[1];
      exd_name = exd_name.substring(0, exd_name.length - 1);
      exd_publisher = " (" + exd_publisher;
      if (exd_publisher == " (2P)") {
        exd_publisher = "";
      }
    }
    else {
      var exd_name = demons_copy[n].level;
      var exd_publisher = "";
    }

    str += "<div style='height: 30px; width: 98%; line-height: 30px; font-size: 20px; margin: 10px 0;'>\
              <span class='lvl-tag' style='width: 30px; height: 30px; float: left;'>";
    if (demons_copy[n].is_2p) {
      str += "<img src='img/2P.png' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>"
    }
    str += "  </span>\
              <span class='lvl-tag' style='width: 30px; height: 30px; float: left;'>";
    if (demons_copy[n].is_mobile) {
      str += "<img src='img/mobile.png' height='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>"
    }
    str +=   "</span>\
              <span class='lvl-place' style='float: left; width: 70px; text-align: center; margin-right: 25px; color: var(" + color + ")'>\
                #" + ((placement == "GDTW") ? (+demons_copy[n].gdtw_placement) : (+demons_copy[n].placement)) + "\
              </span>\
              <span class='lvl-name' style='color: var(" + color + ")'>";
    str += exd_name + "<span style='color: var(--text-note); font-weight: normal'> " + exd_publisher + " &nbsp&nbsp</span>\
              </span>\
              <span class='lvl-link' class='link' style='float: right; width: 30px; height: 30px;'>";
    // video
    if (demons_copy[n].video != " ") {
      if (demons_copy[n].video.includes("facebook.com") || demons_copy[n].video.includes("fb.watch")) {
        var img = "fb.png";
      }
      else if (demons_copy[n].video.includes("youtube.com")) {
        var img = "yt.png";
      }
      else {
        var img = "link.png";
      }
      str += "<a class='link' href=" + demons_copy[n].video + ">\
                <img src='img/" + img + "' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>\
              </a>";
    }
    else {
      str += "<img src='img/broken.png' width='25px' style='position: relative; top: 50%; transform: translateY(-50%)'>";
    }
    str += "  </span>\
              <span  class='lvl-pts' style='float: right; text-align: right; width: 100px; height: 30px; margin-right: 20px;'>\
                " + demons_copy[n].pts + " &nbsppts\
              </span>\
            </div>";
  }
  return str;
}

function loadDetails(pID) {
  let player = players[pID - 1];
  let str = "";
  str += "<div style='margin: 30px 0 30px 40px; height: 50px; width: 90%;'>\
            <h1 style='float: left; color: var(--text-list-default); max-width: 400px; height: 50px; line-height: 50px; margin: 0; overflow: hidden'>" + player.player + "</h1>";
  if (player.contact["left-group"]) {
    str += "<div style='float: left; height: 50px; margin-left: 10px;'>\
              <img src='img/leave.png' title='此玩家已退社' height='30px' style='margin-top: 8px;'>\
            </div>";
  }
  str +=   "<div id='contact'>";
  if ("youtube" in player.contact) {
    str += "  <a href='" + player.contact.youtube + "' style='display: inline-block; margin: 2.5px 5px; height: 45px;'>\
                <img height='45px' src='img/yt_color.png'>\
              </a>";
  }
  if ("facebook" in player.contact) {
    str += "  <a href='" + player.contact.facebook + "' style='display: inline-block; margin: 2.5px 0; height: 45px;'>\
                <img height='45px' src='img/fb_color.png'>\
              </a>";
  }
  if ("gd" in player.contact) {
    str += "  <span style='position: relative; display: inline-block; width: 50px; text-align: center; top: -2px'>\
                <a href='https://gdbrowser.com/u/" + player.contact.gd.username + "' style='display: inline-block; margin: 5px 0; height: 40px;'>\
                  <img height='40px' src='img/icons/" + player.contact.gd.icon + ".png'>\
                </a>";
  }
  str += "  </div>\
          </div>\
          <div id='player-info' style='margin-left: 40px;'>\
            <span class='title' style='grid-column: 1/2; grid-row: 1/2'>\
              玩家排名\
            </span>\
            <span class='title' style='grid-column: 2/3; grid-row: 1/2'>\
              分數\
            </span>\
            <span class='title' style='grid-column: 3/4; grid-row: 1/2'>\
              關卡數\
            </span>\
            <span class='leaderboard-detail-content' style='grid-column: 1/2; grid-row: 2/3'>\
              #" + pID +
            "</span>\
            <span class='leaderboard-detail-content' style='grid-column: 2/3; grid-row: 2/3'>" +
            Math.round(player.points * 100) / 100 +
            "</span>\
            <span class='leaderboard-detail-content' style='grid-column: 3/4; grid-row: 2/3'>" +
            player.levels.length +
            "</span>\
          </div>\
          <div style='margin: 30px 0 20px 40px; width: 98%; height: 35px;'>\
            <h2 style='margin: 0; width: 150px; float: left;'>\
              通關關卡\
            </h2>\
            <div style='display: flex; align-items: center; float: right; height: 35px; margin-right: 45px;'>\
              <span style='margin-right: 10px;'>\
                排序\
              </span>\
              <span id='order-switch-container'>\
                <label id='order-switch-display'>\
                  <input type='checkbox' id='order-switch-checkbox'>\
                  <span id='order-switch'; style='top: " + ((orderBy == "diff") ? "-17px" : "-57px") + "'>\
                    <span>難度</span>\
                    <span>字母</span>\
                  </span>\
                </label>\
              </span>\
              <span style='margin-right: 10px; margin-left: 20px;'>\
                排名依據\
              </span>\
              <span id='placement-switch-container'>\
                <label id='placement-switch-display'>\
                  <input type='checkbox' id='placement-switch-checkbox'>\
                  <span id='placement-switch'; style='top: " + ((placement == "GDTW") ? "-15px" : "-55px") + "'>\
                    <span>GDTW</span>\
                    <span>AREDL</span>\
                  </span>\
                </label>\
              </span>\
            </div>\
          </div>\
          <div id='player-level-list'>" + listDemons(player.levels) + "</div>";
  $("#player-detail").html(str);

  str = "";
  str += "<div id='mobile-player-title' style='margin: 10px 0 30px 40px; height: 50px; width: 90%;'>\
            <h1 style='float: left; color: var(--text-list-default); max-width: 220px; height: 50px; line-height: 50px; margin: 0; overflow: hidden'>" + player.player + "</h1>";
  if (player.contact["left-group"]) {
    str += "<div style='float: left; height: 50px; margin-left: 10px;'>\
              <img src='img/leave.png' title='此玩家已退社' height='30px' style='margin-top: 8px;'>\
            </div>";
  }
  str +=   "<div id='contact'>";
  if ("youtube" in player.contact) {
    str += "  <a href='" + player.contact.youtube + "' style='display: inline-block; margin: 2.5px 5px; height: 45px;'>\
                <img height='45px' src='img/yt_color.png'>\
              </a>";
  }
  if ("facebook" in player.contact) {
    str += "  <a href='" + player.contact.facebook + "' style='display: inline-block; margin: 2.5px 0; height: 45px;'>\
                <img height='45px' src='img/fb_color.png'>\
              </a>";
  }
  if ("gd" in player.contact) {
    str += "  <span style='position: relative; display: inline-block; width: 50px; text-align: center; top: -2px'>\
                <a href='https://gdbrowser.com/u/" + player.contact.gd.username + "' style='display: inline-block; margin: 5px 0; height: 40px;'>\
                  <img height='40px' src='img/icons/" + player.contact.gd.icon + ".png'>\
                </a>";
  }
  str += "  </div>\
          </div>\
          <div id='player-info_mobile' style='margin-left: 40px;'>\
            <span class='title' style='grid-column: 1/2; grid-row: 1/2'>\
              玩家排名\
            </span>\
            <span class='title' style='grid-column: 2/3; grid-row: 1/2'>\
              分數\
            </span>\
            <span class='title' style='grid-column: 3/4; grid-row: 1/2'>\
              關卡數\
            </span>\
            <span class='leaderboard-detail-content' style='grid-column: 1/2; grid-row: 2/3'>\
              #" + pID +
            "</span>\
            <span class='leaderboard-detail-content' style='grid-column: 2/3; grid-row: 2/3'>" +
            Math.round(player.points * 100) / 100 +
            "</span>\
            <span class='leaderboard-detail-content' style='grid-column: 3/4; grid-row: 2/3'>" +
            player.levels.length +
            "</span>\
          </div>\
          <div id='mobile-level-list-title' style='margin: 30px 0 20px 40px; width: 98%; height: 35px;'>\
            <h2 style='margin: 0; width: 150px; float: left;'>\
              通關關卡\
            </h2>\
            <div id='mobile-detail-switches-container' style='display: flex; align-items: center; float: right; height: 35px; margin-right: 45px;'>\
              <span style='margin-right: 5px;'>\
                排序\
              </span>\
              <span id='order-switch-container_mobile'>\
                <label id='order-switch-display_mobile'>\
                  <input type='checkbox' id='order-switch-checkbox_mobile'>\
                  <span id='order-switch_mobile' style='top: " + ((orderBy == "diff") ? "-15px" : "-55px") + "'>\
                    <span>難度</span>\
                    <span>字母</span>\
                  </span>\
                </label>\
              </span>\
              <span id='placement-title' style='margin-right: 5px; margin-left: 20px;'>\
                排名依據\
              </span>\
              <span id='placement-switch-container_mobile'>\
                <label id='placement-switch-display_mobile'>\
                  <input type='checkbox' id='placement-switch-checkbox_mobile'>\
                  <span id='placement-switch_mobile'; style='top: " + ((placement == "GDTW") ? "-12px" : "-52px") + "'>\
                    <span>GDTW</span>\
                    <span>AREDL</span>\
                  </span>\
                </label>\
              </span>\
            </div>\
          </div>\
          <div id='player-level-list_mobile'>" + listDemons(player.levels) + "</div>";
  $("#mobile-detail").html(str);
}

// compute score
function FORMULA(n, aredl, length) {
  let N = (150 - 1) / (length - 1) * (n - 1) + 1;
  let A = 1.0881 * (250 / (0.125 * (N + 7))) * (Math.log(0.125 * (N + 7)) + 1) / Math.pow(1.0881, Math.pow(N, 0.6));
  let B = (aredl > 400) ? 0 : ((401 - aredl) / 400 * 250);
  return Math.round(100 * (A + B)) / 100;
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