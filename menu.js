const navArr = [
  ["index.html", "Top Extremes"],
  ["legacy.html", "Legacy List"],
  ["leaderboard.html", "Leaderboard"],
  ["guidelines.html", "Guidelines"],
  ["changelog.html", "About"]
];

let text = "<button class='menu navdrop'><b>&#9776;</b></button>";
text += "<div class='navdropMenu'>";
for (let i = 0; i < navArr.length; i++){
  text += "<a class='navdropContent";
  if (window.location.pathname == "/GDTWDemonlist/" + navArr[i][0] || (i == 0 && window.location.pathname == "/GDTWDemonlist/")) {
    text += " visiting";
  }
  text += "' target='_self' href='" + navArr[i][0] + "'>" + navArr[i][1] + "</a>";
}
text += "</div>";
text += "<b class='menu'>GDTW Demonlist</b>";
for (let i = 0; i < navArr.length; i++){
  text += "<a class='menu";
  if (window.location.pathname == "/GDTWDemonlist/" + navArr[i][0] || (i == 0 && window.location.pathname == "/GDTWDemonlist/")) {
    text += " visiting";
  }
  text += "' target='_self' href='" + navArr[i][0] + "'>" + navArr[i][1] + "</a>";
}
document.getElementById("menuContainer").innerHTML = text;

//initialize
nav = document.getElementsByClassName("menu");

for (let i = 1; i < nav.length; i++) {
  nav[i].addEventListener('click', function() {
    temp = document.getElementsByClassName('visiting');
    if(temp[0] != nav[i]) {
      temp[0].classList.add('leave');
      temp[0].classList.remove('visiting');
      this.classList.add('visiting');
    }
  });
}

let isAwayDrop = true;
let btn = document.getElementsByClassName("navdrop");
let dropdown = document.getElementsByClassName("navdropMenu");

btn[0].addEventListener('click', function() {
  document.getElementsByClassName('navdropMenu')[0].style.display = "block";
  isAwayDrop = false;
});

dropdown[0].addEventListener('mousedown', function() {
  isAwayDrop = false;
});

btn[0].addEventListener('focusout', function() {
  if (isAwayDrop) {
    document.getElementsByClassName('navdropMenu')[0].style.display = "none";
  }
});

window.onclick = function() {
  if (isAwayDrop) {
    document.getElementsByClassName('navdropMenu')[0].style.display = "none";
  }
  else {
    isAwayDrop = true;
  }
}