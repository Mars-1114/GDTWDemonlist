const navArr = [
  ["index.html", "Top Extremes"],
  ["legacy.html", "Legacy List"],
  ["leaderboard.html", "Leaderboard"],
  ["guidelines.html", "Guidelines"],
  ["changelog.html", "About"]
];

let text = "<button onclick='showmenu()' class='menu navdrop'><b>&#9776;</b></button>";
text += "<div class='navdropMenu'>";
text += "<a class='navdropContent'>test</a>";
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