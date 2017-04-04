"use strict";

var gallery = document.querySelector('#js__list');
var footer = document.querySelector('#js__footer');

//
// Ajax call to get Movies from omdb api
//

var searchButton = document.querySelector('#js__button');

searchButton.addEventListener('click', function (e) {

  console.log(e.target.previousElementSibling.value);
  var searchText = e.target.previousElementSibling;
  if (searchText.value) {
    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }
    var search = searchText.value.split(' ').join('+');
    var url = 'http://www.omdbapi.com/?s=' + search + '&type=movie';
    console.log(url);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          console.log(xhr.response);
          if (xhr.response.Error === "Movie not found!") {
            swal({
              title: "Movie not found",
              text: "Please check for typo's and try again",
              type: "error",
              confirmButtonColor: "#2a3d45"
            });
          } else {
            var json = xhr.response.Search;

            var _loop = function _loop(i) {
              var searchResult = json[i];
              var title = searchResult.Title;
              var poster = searchResult.Poster;
              var imdbID = searchResult.imdbID;
              var posterImage = '';
              if (poster === 'N/A') {
                posterImage = '<svg  class="icons">\n                <use id="' + imdbID + '" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./img/sprite/sprite.svg#icons--popcorn"></use>\n              </svg>\n              <h5>' + title + '</h5>';
              } else {
                posterImage = '<img id="' + imdbID + '" src="' + poster + '" alt="' + title + '"/>';
              }
              var galleryHTML = '\n              <li class="list__item">\n                <a class="list__content" href="' + imdbID + '" title="' + title + '">\n                  ' + posterImage + '\n                </a>\n              </li>\n              ';
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
                    var _posterImage = '';
                    if (_poster === 'N/A') {
                      _posterImage = '<svg class="icons">\n                      <use id="' + imdbID + '"  xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./img/sprite/sprite.svg#icons--popcorn"></use>\n                    </svg>';
                    } else {
                      _posterImage = '<img id="' + imdbID + '" src="' + _poster + '" alt="' + _title + '"/>';
                    }
                    var modalHTML = '\n                  <div id="modal__' + imdbID + '" class="modal">\n                    <button type="button" class="button__modal" onclick="Custombox.modal.closeAll();">Back</button>\n                    ' + _posterImage + '\n                    <h1>' + _title + '</h1>\n                    <p>' + plot + '</p>\n                    <span>Year: </span><span>' + year + '</span>\n                    <span>Categorie: </span><span>' + categorie + '</span>\n                  </div>\n                  ';
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
      }
    };

    xhr.send(null);
    searchText.value = '';
  }
});

// Open
gallery.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);
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
//# sourceMappingURL=app.js.map
