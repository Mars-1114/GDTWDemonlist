const req = new XMLHttpRequest();
req.onload = function() {
  const data = JSON.parse(this.responseText);

  let text = "";
  let temp = [];
  for (let n in data.leaderboard) {
    temp.push(n);
  }
  temp.sort(function(a, b) {
    let scoreA = 0, scoreB = 0;
    let countA = 0, countB = 0;
    let hardestA = Infinity, hardestB = Infinity;
    for (let n = 0; n < data.demon.length; n++) {
      if (data.demon[n][0] in data.leaderboard[a]) {
        if (hardestA > n) {
          hardestA = n;
        }
        scoreA += calculate(n + 1);
        countA++;
      }
      if (data.demon[n][0] in data.leaderboard[b]) {
        if (hardestB > n) {
          hardestB = n;
        }
        scoreB += calculate(n + 1);
        countB++;
      }
    }
    if (scoreA != scoreB) {
      return scoreB - scoreA;
    }
    else if (hardestA != hardestB) {
      return hardestA - hardestB;
    }
    else {
      return countB - countA;
    }
  });
  for (let n in temp) {
    text += "<button class=\"dropdownBtn\"><h2><span style=\"color: #86d9f0\">" + temp[n] + "</span>";
    text += " <span style='font-size:0.8em'> (";
    let score = 0;
    for (let i = 0; i < data.demon.length; i++) {
      if (data.demon[i][0] in data.leaderboard[temp[n]]) {
        score += calculate(i + 1);
      }
    }
    text += score.toFixed(2) + " pts";
    /*text += count + " Extreme Demon";
    if (count > 1) {
        text += "s";
    }*/
    text += ")</span>";
    text += "<span style=\"float: right\">+</span></h2></button>";
    text += "<div class='collapseWrap'><div class=\"collapsable\">" + listPlayer(data.leaderboard[temp[n]], data.demon) + "</div></div>";
  }
  document.getElementById("player").innerHTML = text;
  
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
        content.style.maxHeight = null;
        this.innerHTML = buttonText.replace(">-", ">+");
      }
      else {
        content.style.maxHeight = content.scrollHeight + "px";
        this.innerHTML = buttonText.replace(">+", ">-");
      }
    });
  }
}

if (window.location.pathname == "/GDTWDemonlist/leaderboard.html") {
  req.open("GET", "data.json");
}
else {
  req.open("GET", "plat-data.json");
}
req.send();


//list the demons of the player
function listPlayer(player, list) {
  //list the demon
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i][0] in player) {
      arr.push([list[i][0], player[list[i][0]]].flat());
    }
  }
  arr.sort(function(a, b) { return list.flat().indexOf(a[0]) - list.flat().indexOf(b[0]) });
  //convert to HTML
  let temp = "";
  for (let i = 0; i < arr.length; i++) {
    temp += "<h5>#" + (i + 1) + " " + arr[i][0] + " | ";
    if (arr[i][1] != " ") {
      temp += "<a class='link' href=" + arr[i][1] + " style=\"font-weight: normal\">link</a>";
    }
    else {
      temp += "<span style='color: rgb(235, 110, 101)'>Video Lost</span>"
    }
    temp += "</h5>"
  }
  return temp;
}

function calculate(n) {
  return Math.round(100 * 1.0881 * (250 / (0.125 * (n + 7))) * (Math.log(0.125 * (n + 7)) + 1) / Math.pow(1.0881, Math.pow(n, 0.6))) / 100;
}