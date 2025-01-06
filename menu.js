const navArr = [
  ["index.html", "Top Classics"],
  ["plat.html", "Top Platformers"],
  ["legacy.html", "Legacy List"],
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

$("#menu").on("click", function() {
  if (!$(this).hasClass("visiting")) {
    $(".visiting").addClass("leave").remove("visiting");
    $(this).addClass("visiting");
  }
});

let dropbtnclicked = false;
let dropbtndown = false;
let dropdwnclicked = false;

$(".navdrop").on({
  click: function() {
    if ($(".navdropMenu").css("display") == "none") {
      dropbtnclicked = true;
    }
    else {
      $(".navdropMenu").css("display", "none").trigger("blur");
    }
  },
  mousedown: function() {
    if ($(this).css("display") == "block") {
      dropbtndown = true;
    }
  }
});

$(".navdropMenu").on("click", function() {
  if ($(this).css("display") == "block") {
    dropdwnclicked = true;
  }
});

$("body").on({
  click: function() {
    if (dropbtnclicked) {
      $(".navdropMenu").css("display", "block");
      dropbtnclicked = false;
    }
  },
  mousedown: function() {
    if (!(dropdwnclicked || dropbtndown)) {
      $(".navdropMenu").css("display", "none");
    }
    dropbtnclicked = false;
    dropbtndown = false;
  }
});

$(".navdropContent").on("click", function() {
  $(".visiting").removeClass("visiting");
  $(this).addClass("visiting");
});