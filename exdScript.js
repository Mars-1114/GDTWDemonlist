const req = new XMLHttpRequest();
req.onload = function() {
  
  //get data
  const data = JSON.parse(this.responseText);

  //generate HTML
  let text = "";
  for (let exd = 0; exd < data.demon.length; exd++) {
    text += "<button class='dropdownBtn'><h2>";
    // color
    if (window.location.pathname == "/GDTWDemonlist/plat.html") {
      text += "<i style='color: #a27dff'>";
    }
    else {
      text += "<i style='color: #86d9f0'>";
    }

    text += "#" + (exd + 1) + " " + data.demon[exd][0] + "</i>";
    text += "<i style='font-weight: normal'> by " + data.demon[exd][1] + " </i>";
    text += "<span style='font-size: 15px; font-weight: normal'>&nbsp (";
    text += calculate(exd + 1) + " pts)</span>";
    text += "<span style='float: right'>+</span></h2></button>";
    text += "<div class='collapseWrap'><div class='collapsable'>" + listPlayer(data.leaderboard, data.demon, exd) + "</div></div>";
  }
  document.getElementById("exd").innerHTML = text;

  //show page
  document.getElementsByClassName("loaderContainer")[0].style.display = "none";
  document.getElementsByClassName("content")[0].style.opacity = "100%";
  document.getElementsByClassName("content")[0].style.top = "0";
  document.getElementsByClassName("addr")[0].style.opacity = "100%";

  //toggle dropdown
  let dropdown = document.getElementsByClassName("dropdownBtn");
  for (let i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
      this.classList.toggle("active");
      let content = this.nextElementSibling;
      let buttonText = this.innerHTML;
      if (content.style.maxHeight) {
        this.innerHTML = buttonText.replace(">-", ">+");
        content.style.maxHeight = null;
      }
      else {
        this.innerHTML = buttonText.replace(">+", ">-");
        content.style.maxHeight = content.scrollHeight + "px"
      }
    });
  }
};

if (window.location.pathname == "/GDTWDemonlist/plat.html") {
  req.open("GET", "plat-data.json");
}
else {
  req.open("GET", "data.json");
}
req.send();

//data process
function listPlayer(player, demon, demonId) {
  //list the player
  let arr = [];
  for (let i in player) {
    if (demon[demonId][0] in player[i]) {
      arr.push([i, player[i][demon[demonId][0]]].flat());
    }
  }
  arr.sort(function(a, b) {
    let timeA = new Date(a[2]), timeB = new Date(b[2]);
    return timeA.getTime() - timeB.getTime();
  });
  //convert to HTML
  let temp = "";
  for (let i in arr) {
    temp += "<h5>" + arr[i][0] + " - ";
    if (arr[i][1] != " ") {
      temp += "<a class='link' href=" + arr[i][1] + " style='font-weight: normal'>link</a>";
    }
    else {
      temp += "<span style='color: rgb(235, 110, 101)'>Video Lost</span>"
    }
    if (arr[i][3]) {
      temp += ' <i> "Mobile"</i>'
    }
    temp += "</h5>";
  }
  return temp;
}

//compute score
function calculate(n) {
  return (1.0881 * (250 / (0.125 * (n + 7))) * (Math.log(0.125 * (n + 7)) + 1) / Math.pow(1.0881, Math.pow(n, 0.6))).toFixed(2);
}
