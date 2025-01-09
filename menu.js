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

var text = "<button class='menu navdrop'><b>&#9776;</b></button>";
text += "<div class='navdropMenu'>";
for (let i = 0; i < navArr.length; i++){
  text += "<a class='navdropContent";
  if (path == navArr[i][0] || (i == 0 && path == "")) {
    text += " visiting";
  }
  text += "' target='_self' href='" + navArr[i][0] + "'>" + navArr[i][1] + "</a>";
}
text += "</div>";
text += "<b class='menu'>GDTW Demonlist</b>";
for (let i = 0; i < navArr.length; i++){
  text += "<a class='menu";
  if (path == navArr[i][0] || (i == 0 && path == "")) {
    text += " visiting";
  }
  text += "' target='_self' href='" + navArr[i][0] + "'>" + navArr[i][1] + "</a>";
}
$("#menuContainer").html(text);

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