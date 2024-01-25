const req = new XMLHttpRequest();
req.onload = function() {
  //get data
  const data = JSON.parse(this.responseText);

  //generate HTML
  let text = "";
  for (let n = 0; n < data.legacy.length; n++) {
    text += "<button class=\"dropdownBtn\"><h2><i style=\"color: #86d9f0\">" + data.legacy[n][0] + "</i>";
    text += "<i style=\"font-weight: normal\"> by " + data.legacy[n][1] + "</i>";
    text += "<span style=\"float: right\">+</span></h2></button>";
    text += "<div class='collapseWrap'><div class=\"collapsable\">" + listPlayer(data.leaderboard, data.legacy, n) + "</div></div>";
  }
  document.getElementById("legacy").innerHTML = text;

  //show page
  document.getElementsByClassName("loaderContainer")[0].style.display = "none";
  document.getElementsByClassName("content")[0].style.opacity = "100%";
  document.getElementsByClassName("content")[0].style.top = "0";

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
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }
}

req.open("GET", "data.json");
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
      temp += "<a href=" + arr[i][1] + " style=\"font-weight: normal\">link</a>";
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
