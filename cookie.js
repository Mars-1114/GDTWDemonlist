// check if light mode is on
if (getCookie("light_mode") == "on") {
  lightmode($("#darkmode-switch-checkbox").prop("checked", true));
  lightmode(true);
}

// darkmode checkbox
$("#darkmode-switch-display").on("click", function() {
  lightmode($("#darkmode-switch-checkbox").prop("checked"));
});

/**
 * Search cookie from name.
 * @param {String} name 
 * @returns {String}
 */
function getCookie(name) {
  let cookie_arr = decodeURIComponent(document.cookie).split("; ");
  for (cookie of cookie_arr) {
    let index = cookie.indexOf("=");
    let key = cookie.substring(0, index);
    let val = cookie.substring(index + 1);
    if (key == name) {
      return val;
    }
  }
  return "";
}

/**
 * Toggle light mode
 * @param {Boolean} toggle
 */
function lightmode(toggle) {
  if (toggle) {
    // switch animation
    $("#darkmode-switch").css("left", "36px");
    $("#darkmode-switch-icon").html("light_mode");

    // color
    $(":root")
      .css("--bg", "rgb(240, 255, 248)")
      .css("--menu", "rgb(77, 153, 147)")
      .css("--menu-visit", "rgb(27, 113, 113)")
      .css("--menu-mobile-hover", "rgb(51, 114, 109)")
      .css("--menu-mobile-nav", "rgb(85, 145, 125)")
      .css("--menu-mobile-nav-hover", "rgb(71, 118, 101)")
      .css("--text-default", "black")
      .css("--text-title", "rgb(240, 255, 248)")
      .css("--text-highlight", "rgb(38, 122, 148)")
      .css("--text-highlight-important", "rgb(220, 52, 52)")
      .css("--text-highlight-allow", "rgb(14, 186, 14)")
      .css("--text-platformer", "rgb(123, 45, 172)")
      .css("--text-list-top", "rgb(186, 29, 29)")
      .css("--text-list-main", "rgb(177, 166, 40)")
      .css("--text-list-extended", "rgb(0, 156, 8)")
      .css("--text-list-default", "rgb(48, 101, 125)")
      .css("--text-addition", "rgb(53, 86, 139)")
      .css("--text-removal", "rgb(203, 33, 21)")
      .css("--text-loader", "rgb(31, 57, 82)")
      .css("--link-default", "rgb(131, 7, 156)")
      .css("--link-hover", "rgb(0, 155, 186)")
      .css("--link-menu", "rgb(2, 41, 28)")
      .css("--link-menu-nav-hover", "rgb(211, 255, 240)")
      .css("--link-visit", "rgb(211, 255, 240)")
      .css("--list-base", "rgb(182, 208, 222)")
      .css("--list-border", "rgb(132, 166, 185)")
      .css("--switch", "rgb(232, 255, 182)")
      .css("--switch-base", "rgb(38, 77, 66)")
      .css("--footer", "rgb(191, 225, 216)")
      .css("--scroll-to-top-base", "rgb(93, 135, 125)");

    // set cookie
    document.cookie = "light_mode=on";
  }
  else {
    // switch animation
    $("#darkmode-switch").css("left", "8px");
    $("#darkmode-switch-icon").html("dark_mode");

    // color
    $(":root")
      .css("--bg", "rgb(31, 33, 46)")
      .css("--menu", "rgb(52, 92, 116)")
      .css("--menu-visit", "rgb(81, 149, 191)")
      .css("--menu-mobile-hover", "rgb(46, 78, 101)")
      .css("--menu-mobile-nav", "rgb(105, 152, 149)")
      .css("--menu-mobile-nav-hover", "rgb(85, 125, 123)")
      .css("--text-default", "white")
      .css("--text-title", "rgb(165, 192, 255)")
      .css("--text-highlight", "rgb(199, 227, 255)")
      .css("--text-highlight-important", "rgb(243, 159, 159)")
      .css("--text-highlight-allow", "rgb(89, 214, 89)")
      .css("--text-platformer", "#a27dff")
      .css("--text-list-top", "rgb(195, 77, 77)")
      .css("--text-list-main", "rgb(223, 193, 125)")
      .css("--text-list-extended", "rgb(24, 186, 32)")
      .css("--text-list-default", "rgb(134, 217, 240)")
      .css("--text-addition", "rgb(167, 255, 255)")
      .css("--text-removal", "rgb(235, 110, 101)")
      .css("--text-loader", "rgb(120, 140, 161)")
      .css("--link-default", "rgb(181, 163, 199)")
      .css("--link-hover", "rgb(211, 255, 240)")
      .css("--link-menu", "rgb(207, 207, 207)")
      .css("--link-menu-nav-hover", "rgb(211, 255, 240)")
      .css("--link-visit", "rgb(211, 255, 240)")
      .css("--list-base", "rgb(43, 48, 70)")
      .css("--list-border", "#36444e")
      .css("--switch", "rgb(174, 138, 207)")
      .css("--switch-base", "rgb(29, 52, 60)")
      .css("--footer", "rgb(39, 42, 57)")
      .css("--scroll-to-top-base", "rgb(114, 193, 188)");

    // delete cookie
    document.cookie = "light_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
  }
}