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
let nav = document.getElementsByClassName("menu");
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

let dropbtnclicked = false;
let dropbtndown = false;
let dropdwnclicked = false;
let btn = document.getElementsByClassName("navdrop");
let dropdown = document.getElementsByClassName("navdropMenu");

btn[0].addEventListener('click', function() {
  if (document.getElementsByClassName("navdropMenu")[0].style.display == "none") {
    dropbtnclicked = true;
  }
  else {
    document.getElementsByClassName("navdropMenu")[0].style.display = "none";
    btn[0].blur();
  }
});

btn[0].addEventListener("mousedown", function() {
  if (document.getElementsByClassName("navdropMenu")[0].style.display == "block") {
    dropbtndown = true;
  }
});

dropdown[0].addEventListener('mousedown', function() {
  if (document.getElementsByClassName("navdropMenu")[0].style.display == "block") {
    dropdwnclicked = true;
  }
});

document.body.addEventListener('click', function() {
  if (dropbtnclicked) {
    document.getElementsByClassName("navdropMenu")[0].style.display = "block";
    dropbtnclicked = false;
  }
});

document.body.addEventListener("mousedown", function() {
  if (!dropdwnclicked) {
    if (!dropbtndown) {
      document.getElementsByClassName("navdropMenu")[0].style.display = "none";
    }
  }
  dropdwnclicked = false;
  dropbtndown = false;
});


let nav2 = document.getElementsByClassName("navdropContent");
for (let i = 1; i < nav2.length; i++) {
  nav2[i].addEventListener('click', function() {
    temp2 = document.getElementsByClassName('visiting');
    temp2[0].classList.remove('visiting');
    this.classList.add('visiting');
  });
}