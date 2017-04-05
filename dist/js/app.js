"use strict";

var gallery = document.querySelector('#js__list');
var footer = document.querySelector('#js__footer');
var searchButton = document.querySelector('#js__button');

//
// Ajax call to get Movies from omdb api
//

function emptyGallery(gallery) {
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
}

function createGallery() {
  if (this.readyState === this.DONE) {
    if (this.status === 200) {
      if (this.response.Error === "Movie not found!") {
        swal({
          title: "Movie not found",
          text: "Please check for typo's and try again",
          type: "error",
          confirmButtonColor: "#2a3d45"
        });
      } else {
        var json = this.response.Search;
        for (var i = 0; i < json.length; i++) {
          var searchResult = json[i];
          var title = searchResult.Title;
          var poster = searchResult.Poster;
          var imdbID = searchResult.imdbID;
          var posterImage = '';
          if (poster === 'N/A') {
            posterImage = '<svg  class="icons">\n            <use id="' + imdbID + '" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./img/sprite/sprite.svg#icons--popcorn"></use>\n          </svg>\n          <h5>' + title + '</h5>';
          } else {
            posterImage = '<img id="' + imdbID + '" src="' + poster + '" alt="' + title + '"/>';
          }
          var galleryHTML = '\n          <li class="list__item">\n            <a class="list__content" href="' + imdbID + '" title="' + title + '">\n              ' + posterImage + '\n            </a>\n          </li>\n          ';
          gallery.insertAdjacentHTML('afterbegin', galleryHTML);

          // Call to create modals
          var url = 'https://www.omdbapi.com/?i=' + imdbID;
          ajaxCall(url, createModals);
        }
      }
    }
  }
};

function createModals() {
  if (this.readyState === this.DONE) {
    if (this.status === 200) {
      var searchResult = this.response;
      var imdbID = searchResult.imdbID;
      var genre = searchResult.Genre;
      var plot = searchResult.Plot;
      var title = searchResult.Title;
      var year = searchResult.Released;
      var poster = searchResult.Poster;
      var rating = searchResult.Ratings[0].Value;
      var stars = searchResult.Actors;
      var posterImage = '';
      if (poster === 'N/A') {
        posterImage = '<svg class="icons">\n        <use id="' + imdbID + '"  xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./img/sprite/sprite.svg#icons--popcorn"></use>\n      </svg>';
      } else {
        posterImage = '<img class="modal__image" id="' + imdbID + '" src="' + poster + '" alt="' + title + '"/>';
      }
      var modalHTML = '\n    <div id="modal__' + imdbID + '" class="modal">\n      <div class="modal__layout">\n        <button type="button" class="button__modal" onclick="Custombox.modal.closeAll();">Back</button>\n        ' + posterImage + '\n        <div class="modal__content">\n          <h1>' + title + '</h1>\n          <p>' + plot + '</p>\n          <div class="modal__facts">\n            <span class="modal__fact">Release Date: </span><span class="modal__fact">' + year + '</span>\n            <span class="modal__fact">Genre: </span><span class="modal__fact">' + genre + '</span>\n            <span class="modal__fact">Rating: </span><span class="modal__fact">' + rating + '</span>\n            <span class="modal__fact">Stars: </span><span class="modal__fact">' + stars + '</span>\n          </div>\n        </div>\n      </div>\n    </div>\n    ';
      footer.insertAdjacentHTML('afterend', modalHTML);
    }
  }
};

function callGallery() {
  var searchText = document.querySelector('.search__input');
  if (searchText.value) {
    emptyGallery(gallery);
    var search = searchText.value.split(' ').join('+');
    var url = 'https://www.omdbapi.com/?s=' + search + '&type=movie';

    ajaxCall(url, createGallery);
    searchText.value = '';
  }
}

function ajaxCall(url, name) {
  var oReq = new XMLHttpRequest();
  oReq.responseType = 'json';
  oReq.addEventListener('load', name);
  oReq.open("get", url, true);
  oReq.send();
}

function createFavoritesGallery() {
  if (this.readyState === this.DONE) {
    if (this.status === 200) {
      var searchResult = this.response;
      var title = searchResult.Title;
      var poster = searchResult.Poster;
      var imdbID = searchResult.imdbID;
      var galleryHTML = '\n      <li class="list__item">\n        <a class="list__content" href="' + imdbID + '" title="' + title + '">\n          <img id="' + imdbID + '" src="' + poster + '" alt="' + title + '"/>\n        </a>\n      </li>\n      ';
      gallery.insertAdjacentHTML('beforeend', galleryHTML);
    }
  }
};
function sofianFavorites() {
  var myMovies = ['tt0119116', 'tt0414993', 'tt2015381', 'tt0468569', 'tt0119174', 'tt1568346', 'tt0347149', 'tt2488496'];
  for (var i = 0; i < myMovies.length; i++) {
    var movie = myMovies[i];
    var url = 'https://www.omdbapi.com/?i=' + movie;
    ajaxCall(url, createFavoritesGallery);
    ajaxCall(url, createModals);
  }
}
sofianFavorites();
//
// Add event listener to search input and button
//

searchButton.addEventListener('click', callGallery);
searchButton.previousElementSibling.addEventListener('change', callGallery);

//
// Open modal on click
//

gallery.addEventListener('click', function (e) {
  e.preventDefault();
  var imdbID = e.target.id;
  var modal = new Custombox.modal({
    content: {
      fullscreen: true,
      effect: 'fadein',
      target: '#modal__' + imdbID
    },
    loader: {
      active: true,
      color: '#000',
      speed: 1500
    }
  });
  modal.open();
});
//# sourceMappingURL=app.js.map
