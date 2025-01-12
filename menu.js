const navArr = [
  ["index.html", "Classical"],
  ["plat.html", "Platformer"],
  ["legacy.html", "Legacy"],
  ["leaderboard.html", "Leaderboard"],
  ["plat-leaderboard.html", "Platformer Leaderboard"],
  ["guidelines.html", "Guidelines"],
  ["changelog.html", "About"]
];

var path = window.location.pathname;
path = path.split("/")[path.split("/").length - 1];

// navigation menu (mobile)
var str = "<button class='menu navdrop'><b>&#9776;</b></button>\
          <div class='navdropMenu'>";
for (let i = 0; i < navArr.length; i++){
  str += "<a class='navdropContent";
  if (path == navArr[i][0] || (i == 0 && path == "")) {
    str += " visiting";
  }
  str += "' target='_self' href='" + navArr[i][0] + "'>" + navArr[i][1] + "</a>";
}
// navigation menu (PC)
str += "</div>\
        <b class='menu'>GDTW Demonlist</b>";
for (let i = 0; i < navArr.length; i++){
  str += "<a class='menu";
  if (path == navArr[i][0] || (i == 0 && path == "")) {
    str += " visiting";
  }
  str += "' target='_self' href='" + navArr[i][0] + "'>" + navArr[i][1] + "</a>";
}
// dark mode
str += "<span id='darkmode-switch-container'>\
          <label id='darkmode-switch-display'>\
            <input type='checkbox' id='darkmode-switch-checkbox'>\
            <span id='darkmode-switch'>\
              <span id='darkmode-switch-icon' class='material-symbols-outlined' style='font-size: 20px'>\
                dark_mode\
              </span>\
            </span>\
          </label>\
        </span>";

$("#menuContainer").html(str);

$(".menu").on("click", function() {
  if (!$(this).hasClass("visiting")) {
    $(".visiting").addClass("leave").remove("visiting");
    $(this).addClass("visiting");
  }
});

let dropdownclick = false;

$(".navdrop").on("click", function() {
  if ($(".navdropMenu").css("display") == "none") {
    $(".navdropMenu").css("display", "block");
  }
  else {
    $(".navdropMenu").css("display", "none");
    $(this).trigger("blur");
  }
});

$("body").on("click", ".navdrop, .navdropMenu", function() {
  dropdownclick = true;
})

$("body").on("click", function() {
  if (!dropdownclick) {
    $(".navdropMenu").css("display", "none");
  }
  dropdownclick = false;
})

$(".navdropContent").on("click", function() {
  $(".visiting").removeClass("visiting");
  $(this).addClass("visiting");
});

$(window).on("resize", function() {
  $(".navdropMenu").css("display", "none");
})

let onTop = true;
$("#scroll-to-top").on("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  $("#scroll-to-top").css("bottom", "-70px");
});

$(window).on("wheel", function() {
  if ($(window).scrollTop() > 30) {
    onTop = true;
  }
})

$(document).on("scroll", function() {
  if ($(window).scrollTop() < 30) {
    onTop = true;
    $("#scroll-to-top").css("bottom", "-70px");
  }
  else if (onTop) {
    onTop = false;
    $("#scroll-to-top").css("bottom", "0");
  }
})