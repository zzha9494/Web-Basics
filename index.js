window.onload = function () {
  var bookCount = document.getElementById("bookCount");
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
        var elem = titles[i];
        elem.parentNode.style.backgroundColor = "transparent"; // reset
        if (elem.innerHTML.toLowerCase().indexOf(keyWord.toLowerCase()) != -1) {
          elem.parentNode.style.backgroundColor = "green";
          hasResult = true;
        }
      }
      if (!hasResult) alert("No items found."); // boundary case
    } else {
      // can clear the highlighted color here.
      for (let i = 0; i < titles.length; i++) {
        titles[i].parentNode.style.backgroundColor = "transparent";
      }
      alert("Please input keyword."); // boundary case
    }
  });

  // filter
  var filterButton = (document.getElementById("filter").onclick = function () {
    var categories = document.querySelectorAll(".category");
    var category = document.getElementById("categoryInput").value.trim();
    if (category) {
      // show here filter
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].innerHTML.toLowerCase() != category.toLowerCase()) {
          categories[i].parentNode.style.display = "none";
        }
      }
    } else {
      // show all
      for (let i = 0; i < categories.length; i++) {
        categories[i].parentNode.style.display = "table-row";
      }
    }
  });

  // add book
  var addButton = (document.getElementById("add").onclick = function () {
    var radios = document.getElementsByName("select");
    var selectedItem;
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        selectedItem = radios[i];
        break;
      }
    }
    if (!selectedItem) {
      alert("No selected item found.");
      return;
    }
    var quantity = prompt("Item quantity?", 1);
    if (!quantity) {
      return;
    } else {
      var temp =
        parseInt(
          bookCount.innerHTML.substring(1, bookCount.innerHTML.length - 1)
        ) + parseInt(quantity);
      bookCount.innerHTML = "(" + temp + ")";
      selectedItem.checked = false;
    }
  });

  // reset
  var resetButton = (document.getElementById("reset").onclick = function () {
    if (confirm("Is it okay to reset the cart?")) {
      bookCount.innerHTML = "(0)";
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
        else if (j == 8) td.setAttribute("class", "category");
        var text = document.createTextNode(bookList[i][tdKey[j]]);
        td.appendChild(text);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}
