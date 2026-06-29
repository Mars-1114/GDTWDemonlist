// TODO:
// 0. REWORK WEBSITE
// 1. 新增個人通關關卡名次選項
// 2. 幫幻月加30000分
// 3. 搜尋功能
// 4. unreliable 2P flag from AREDL

let file = "data.json";
let contact_file = "player-contact.json";
let site = "https://api.aredl.net/v2/api/aredl/levels";

let local_data;
let exd_arr = [];
let levels = [];
let first_load = false;

$.getJSON(file, function(data) {
    local_data = data;
    $.ajax(
        {
            url: site,
            type: "GET",
            success: function(data) {
                for (let i = 0; i < local_data['demon'].length; i++) {
                    let exd_local = local_data['demon'][i];
                    for (let j = 0; j < data.length; j++) {
                        let exd_raw = data[j];
                        let id = exd_raw.level_id + (exd_raw.two_player ? "_2p" : "");
                        if (exd_local[1] == id) {
                            // extract data
                            exd_arr.push(exd_raw);
                            break;
                        }
                    }
                }
                console.log(exd_arr);
            }
        }
    )
});

$(document).ajaxStop(function() {
    if (first_load) {return;}
    first_load = true

  // sort by placement
  exd_arr.sort((a, b) => a.position - b.position);

  // structure data
  for (let level in exd_arr) {
    let lvl_name = exd_arr[level].name;
    let id = (lvl_name.includes("(2P)")) ? exd_arr[level].level_id + "_2p" : exd_arr[level].level_id;

    // extract level name
    let deli_pos = lvl_name.indexOf("(");
    let multi_lvl = false;
    if (deli_pos != -1) {
      if (lvl_name.substring(deli_pos + 1, lvl_name.length - 1) != "2P") {
        multi_lvl = true;
      }
      lvl_name = lvl_name.substring(0, deli_pos);
    }

    let lvl = {
      name: lvl_name,
      id: id,
      id_display: exd_arr[level].level_id,
        publisher: exd_arr[level].publisher_id,
      placement: +exd_arr[level].position,
      gdtw_placement: +level + 1,
      is_2p: exd_arr[level].two_player,
      multi_lvl: multi_lvl,
      pts: FORMULA(+level + 1, +exd_arr[level].position, exd_arr.length),
      completion: []
    }

    // check player completion
    for (let player in local_data.player) {
      if (id in local_data.player[player]) {
        let player_completion = {
          player: player,
          video: local_data.player[player][id].video,
          is_mobile: local_data.player[player][id].is_mobile,
          completion_date: local_data.player[player][id].completion_date
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

  var str = "";
  for (let level of levels) {
    // level name color
    if (level.placement <= 50) {
      var color = "--text-list-top";
    }
    else if (level.placement <= 75) {
      var color = "--text-list-main";
    }
    else if (level.placement <= 150) {
      var color = "--text-list-extended";
    }
    else {
      var color = "--text-list-default";
    }

    str += "<div class='leaderboard-btn";
    if (level.gdtw_placement == 1) {
      str += " selected";
    }
    str += "' data-id='" + level.gdtw_placement + "'>\
              <h3>\
                <span style='width: 40px; color: var(" + color + "); float: left; text-align: right; padding-right: 20px; padding-left: 15px;'>\
                  #" + level.gdtw_placement + "\
                </span>";

    if (level.is_2p) {
      str += "  <span style='color: var(--text-note); float: left; font-weight: normal'>\
                  [2P]&nbsp&nbsp\
                </span>";
    }

    str += "    <span style='color: var(" + color + "); float: left'>" + level.name + "</span>\
                <span style='float: right; font-size: 0.9em'>" +
                  level.pts.toFixed(2) + " pts\
                </span>";

    if (level.multi_lvl) {
      str += "<span style='color: var(--text-note); float: left; font-weight: normal'>\
              </span>";
    }

    str += "  </h3>\
            </div>";
  }
  $("#player").html(str);

  // mobile
  str = "";
  for (let level of levels) {
    // level name color
    if (level.placement <= 50) {
      var color = "--text-list-top";
    }
    else if (level.placement <= 75) {
      var color = "--text-list-main";
    }
    else if (level.placement <= 150) {
      var color = "--text-list-extended";
    }
    else {
      var color = "--text-list-default";
    }

    str += "<div class='leaderboard-btn' data-id='" + level.gdtw_placement + "'>\
              <h3>\
                <span style='width: 40px; color: var(" + color + "); float: left; text-align: right; padding-right: 20px;'>\
                  #" + level.gdtw_placement + "\
                </span>";

    if (level.is_2p) {
      str += "  <span style='color: var(--text-note); float: left; font-weight: normal'>\
                  [2P]&nbsp&nbsp\
                </span>";
    }

    str += "    <span style='color: var(" + color + "); float: left'>" + level.name + "</span>\
                <span style='float: right; font-size: 0.9em'>" +
                  level.pts.toFixed(2) + " pts\
                </span>";

    if (level.multi_lvl) {
      str += "<span style='color: var(--text-note); float: left; font-weight: normal'>\
              </span>";
    }

    str += "  </h3>\
            </div>\
            <div style='width: 95%; border-bottom: solid 2px var(--list-border); margin: 5px auto;'></div>";
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
      else if (player.video.includes("bilibili.com")) {
        var img = "bilibili.png";
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
    let lvl = levels[dID - 1];
    console.log(lvl)
    $.ajax({
        url: "https://api.aredl.net/v2/api/users/" + lvl.publisher,
        type: "GET",
        success: function(data) {
            let publisher = data.global_name;
            // level name color
            if (lvl.placement <= 50) {
                var color = "--text-list-top";
            }
            else if (lvl.placement <= 75) {
                var color = "--text-list-main";
            }
            else if (lvl.placement <= 150) {
                var color = "--text-list-extended";
            }
            else {
                var color = "--text-list-default";
            }

            let str = "";
            str += "<div style='margin: 30px 0 5px 40px; height: 50px; width: 90%;'>\
            <h1 style='float: left; color: var(" + color + "); max-width: 400px; height: 50px; line-height: 50px; margin: 0'>" +
                ((lvl.is_2p) ? "<span style='font-weight: normal; color: var(--text-note);'>[2P]&nbsp&nbsp</span>" : "") +
                lvl.name +
                "</h1>\
              </div>\
              <div style='font-size: 18px; margin: 0 0 30px 40px;'>\
                <i>by &nbsp"+ publisher + "</i>\
          </div>\
          <div id='player-info' style='margin-left: 40px;'>\
            <span class='title' style='grid-column: 1/2; grid-row: 1/2'>\
              排名 [AREDL]\
            </span>\
            <span class='title' style='grid-column: 2/3; grid-row: 1/2'>\
              關卡ID\
            </span>\
            <span class='title' style='grid-column: 3/4; grid-row: 1/2'>\
              分數\
            </span>\
            <span class='leaderboard-detail-content' style='grid-column: 1/2; grid-row: 2/3'>\
              #" + lvl.gdtw_placement + "<span style='color: var(--text-note)'> [ #" + lvl.placement + " ]</span>\
            </span>\
            <span class='leaderboard-detail-content' style='grid-column: 2/3; grid-row: 2/3'>" +
                lvl.id_display +
                "</span>\
                <span class='leaderboard-detail-content' style='grid-column: 3/4; grid-row: 2/3'>" +
                lvl.pts +
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
            str += "<div style='margin: 0 0 0 40px; height: 50px; width: 90%;'>\
            <h1 style='float: left; color: var(" + color + "); max-width: 400px; height: 50px; line-height: 50px; margin: 0'>" +
                ((lvl.is_2p) ? "<span style='font-weight: normal; color: var(--text-note);'>[2P]&nbsp&nbsp</span>" : "") +
                lvl.name +
                "</h1>\
              </div>\
              <div style='font-size: 14px; margin: 0 0 30px 40px;'>\
                <i>by &nbsp"+ publisher + "</i>\
          </div>\
          <div id='player-info_mobile' style='margin-left: 40px;'>\
            <span class='title' style='grid-column: 1/2; grid-row: 1/2'>\
              排名 [AREDL]\
            </span>\
            <span class='title' style='grid-column: 2/3; grid-row: 1/2'>\
              關卡ID\
            </span>\
            <span class='title' style='grid-column: 3/4; grid-row: 1/2'>\
              分數\
            </span>\
            <span class='leaderboard-detail-content' style='grid-column: 1/2; grid-row: 2/3'>\
              #" + lvl.gdtw_placement + "<span style='color: var(--text-note)'> [ #" + lvl.placement + " ]</span>\
            </span>\
            <span class='leaderboard-detail-content' style='grid-column: 2/3; grid-row: 2/3'>" +
                lvl.id_display +
                "</span>\
                <span class='leaderboard-detail-content' style='grid-column: 3/4; grid-row: 2/3'>" +
                lvl.pts +
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
    });
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

function formatDate(dateStr) {
  let first_deli = dateStr.indexOf("-");
  let second_deli = dateStr.lastIndexOf("-");
  return dateStr.substring(0, first_deli) + "/" + dateStr.substring(first_deli + 1, second_deli) + "/" + dateStr.substring(second_deli + 1);
}