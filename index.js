window.onload = function () {
  // read json
  bookList = []; // book list container
  getJsonObject(
    "data.json",
    function (data) {
      bookList = data; // store the book list into bookList
      loadBooks();
    },
    function (xhr) {
      console.error(xhr);
    }
  );

  // search
  var searchButton = (document.getElementById("search").onclick = function (e) {
    e.preventDefault(); // type=submit incurs auto refresh
    var titles = document.querySelectorAll(".title");
    var keyWord = document.getElementById("keyWord").value.trim();
    if (keyWord) {
      var hasResult = false;
      for (let i = 0; i < titles.length; i++) {
        var elem = titles[i]; // reset
        elem.parentNode.style.backgroundColor = "transparent";
        if (elem.innerHTML.toLowerCase().indexOf(keyWord.toLowerCase()) != -1) {
          elem.parentNode.style.backgroundColor = "green";
          hasResult = true;
        }
      }
      if (!hasResult) alert("No items found."); // boundary case
    } else {
      alert("Please input keyword."); // boundary case
      // can clear the highlighted color here.
    }
  });
};

function getJsonObject(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

function loadBooks() {
  var tbody = document.getElementsByTagName("tbody")[0];
  var tdKey = [
    "input",
    "img",
    "title",
    "rating",
    "authors",
    "year",
    "price",
    "publisher",
    "category",
  ];
  // console.log(tdKey[1]);
  for (let i = 0; i < bookList.length; i++) {
    // console.log(bookList[i])
    // console.log(bookList[0][tdKey[1]]);
    var tr = document.createElement("tr");
    for (let j = 0; j < tdKey.length; j++) {
      var td = document.createElement("td");
      if (j == 0) {
        // radio
        var input = document.createElement("input");
        input.setAttribute("type", "radio");
        input.setAttribute("name", "select");
        input.setAttribute("value", i);
        td.appendChild(input);
      } else if (j == 1) {
        // img
        var img = document.createElement("img");
        img.setAttribute("src", bookList[i][tdKey[j]]);
        img.setAttribute("alt", "Book");
        img.setAttribute("class", "bookImg");
        td.appendChild(img);
      } else if (j == 3) {
        // rating stars
        var num = bookList[i][tdKey[j]];
        for (let i = 0; i < num; i++) {
          var img = document.createElement("img");
          img.setAttribute("src", "images\\star-16.ico");
          img.setAttribute("alt", "star");
          td.appendChild(img);
        }
        for (let i = 0; i < 5 - num; i++) {
          var img = document.createElement("img");
          img.setAttribute("src", "images\\outline-star-16.ico");
          img.setAttribute("alt", "out-star");
          td.appendChild(img);
        }
        td.setAttribute("class", "ratings");
      } else {
        if (j == 2) td.setAttribute("class", "title");
        var text = document.createTextNode(bookList[i][tdKey[j]]);
        td.appendChild(text);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}
