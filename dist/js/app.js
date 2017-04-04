'use strict';

//
// CustomBox Plugin (Vanilla JS)
//


var gallery = document.querySelector('#js__list');
var footer = document.querySelector('#js__footer');

//
// Vanilla JS search box
//

var searchBox = document.querySelector('.search__input');
var a = document.querySelectorAll('.list__content');
searchBox.addEventListener("keyup", function () {
  var inputText = search.value.toLowerCase();
  var j = 0;
  for (var i = 0; i < a.length; i++) {
    var captionText = a[i].getAttribute("title").toLowerCase();
    if (captionText.includes(inputText)) {
      a[i].parentElement.style.display = "block";
    } else {
      a[i].parentElement.style.display = "none";
    }
  }
});

//
// Ajax call to get Movies from omdb api
//

var searchButton = document.querySelector('#js__button');

searchButton.addEventListener('click', function (e) {
  console.log(e.target.previousElementSibling.value);
  var searchText = e.target.previousElementSibling.value;
  var search = searchText.split(' ').join('+');
  var url = 'http://www.omdbapi.com/?s=' + search + '&type=movie';
  console.log(url);

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        var json = xhr.response.Search;

        var _loop = function _loop(i) {
          var searchResult = json[i];
          var title = searchResult.Title;
          var type = searchResult.Type;
          var poster = searchResult.Poster;
          var imdbID = searchResult.imdbID;
          var galleryHTML = '\n          <li class="list__item">\n            <a class="list__content" href="' + imdbID + '" title="' + title + '">\n              <img id="' + imdbID + '" src="' + poster + '" alt="' + title + '"/>\n            </a>\n          </li>\n          ';
          gallery.insertAdjacentHTML('afterbegin', galleryHTML);

          var url = 'http://www.omdbapi.com/?i=' + imdbID;
          var xhr2 = new XMLHttpRequest();
          xhr2.open('GET', url, true);
          xhr2.responseType = 'json';
          xhr2.onload = function () {
            if (xhr2.readyState === xhr2.DONE) {
              if (xhr2.status === 200) {
                var json2 = xhr2.response;
                var _searchResult = json2;
                var categorie = _searchResult.Genre;
                var plot = _searchResult.Plot;
                var _title = _searchResult.Title;
                var year = _searchResult.Year;
                var _poster = _searchResult.Poster;
                var modalHTML = '\n                <div id="modal__' + imdbID + '" class="modal">\n                  <button type="button" class="button__modal" onclick="Custombox.modal.closeAll();">Back</button>\n                  <img id="' + imdbID + '" src="' + _poster + '" alt="' + _title + '"/>\n                  <h1>' + _title + '</h1>\n                  <p>' + plot + '</p>\n                  <span>Year: </span><span>' + year + '</span>\n                  <span>Categorie: </span><span>' + categorie + '</span>\n                </div>\n                ';
                footer.insertAdjacentHTML('afterend', modalHTML);
              }
            }
          };
          xhr2.send(null);
        };

        for (var i = 0; i < json.length; i++) {
          _loop(i);
        }
      }
    }
  };

  xhr.send(null);
});

// Open
gallery.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target.id);
  var imdbID = e.target.id;
  // Instantiate new modal
  var modal = new Custombox.modal({
    content: {
      fullscreen: true,
      effect: 'fadein',
      target: '#modal__' + imdbID
    }
  });
  modal.open();
});

//
// Localstorage for saving images
//
if (localStorageSupport()) {
  // localStorage.setItem('image', );
  // let moviePicture = eval(localStorage.getItem('image'));
}

function localStorageSupport() {
  return 'localStorage' in window && window['localStorage'] !== null;
}
//# sourceMappingURL=app.js.map
