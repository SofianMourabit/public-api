"use strict";

let gallery = document.querySelector('#js__list');
let footer = document.querySelector('#js__footer');
let searchButton = document.querySelector('#js__button');

//
// Ajax call to get Movies from omdb api
//

function emptyGallery(gallery){
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
}

function createGallery () {
  if (this.readyState === this.DONE) {
    if (this.status === 200) {
      if(this.response.Error === "Movie not found!"){
        swal({
          title: "Movie not found",
          text: "Please check for typo's and try again",
          type: "error",
          confirmButtonColor: "#2a3d45",
        });
      }else{
        let json = this.response.Search;
        for(let i = 0; i < json.length; i++) {
          let searchResult = json[i];
          let title = searchResult.Title;
          let poster = searchResult.Poster;
          let imdbID = searchResult.imdbID;
          let posterImage ='';
          if(poster === 'N/A'){
            posterImage =`<svg  class="icons">
            <use id="${imdbID}" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./img/sprite/sprite.svg#icons--popcorn"></use>
          </svg>
          <h5>${title}</h5>`
          }else {
            posterImage =`<img id="${imdbID}" src="${poster}" alt="${title}"/>`
          }
          let galleryHTML = `
          <li class="list__item">
            <a class="list__content" href="${imdbID}" title="${title}">
              ${posterImage}
            </a>
          </li>
          `;
          gallery.insertAdjacentHTML('afterbegin',galleryHTML);

          // Call to create modals
          const url = `https://www.omdbapi.com/?i=${imdbID}`;
          ajaxCall(url,createModals);
        }
      }
    }
  }
};

function createModals () {
  if (this.readyState === this.DONE) {
    if (this.status === 200) {
      let searchResult = this.response;
      let imdbID = searchResult.imdbID;
      let genre = searchResult.Genre;
      let plot = searchResult.Plot;
      let title = searchResult.Title;
      let year = searchResult.Released;
      let poster = searchResult.Poster;
      let rating = searchResult.Ratings[0].Value;
      let stars = searchResult.Actors;
      let posterImage ='';
      if(poster === 'N/A'){
        posterImage =
        `<svg class="icons">
        <use id="${imdbID}"  xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./img/sprite/sprite.svg#icons--popcorn"></use>
      </svg>`
    }else {
      posterImage =`<img class="modal__image" id="${imdbID}" src="${poster}" alt="${title}"/>`
    }
    let modalHTML = `
    <div id="modal__${imdbID}" class="modal">
      <div class="modal__layout">
        <button type="button" class="button__modal" onclick="Custombox.modal.closeAll();">Back</button>
        ${posterImage}
        <div class="modal__content">
          <h1>${title}</h1>
          <p>${plot}</p>
          <div class="modal__facts">
            <span class="modal__fact">Release Date: </span><span class="modal__fact">${year}</span>
            <span class="modal__fact">Genre: </span><span class="modal__fact">${genre}</span>
            <span class="modal__fact">Rating: </span><span class="modal__fact">${rating}</span>
            <span class="modal__fact">Stars: </span><span class="modal__fact">${stars}</span>
          </div>
        </div>
      </div>
    </div>
    `;
    footer.insertAdjacentHTML('afterend',modalHTML);
  }
}
};

function callGallery(){
  let searchText = document.querySelector('.search__input');
  if(searchText.value){
    emptyGallery(gallery);
    let search = searchText.value.split(' ').join('+');
    const url = `https://www.omdbapi.com/?s=${search}&type=movie`;

    ajaxCall(url,createGallery);
    searchText.value ='';
  }
}

function ajaxCall(url,name){
  let oReq = new XMLHttpRequest();
  oReq.responseType = 'json';
  oReq.addEventListener('load', name);
  oReq.open("get", url, true);
  oReq.send();
}

function createFavoritesGallery () {
  if (this.readyState === this.DONE) {
    if (this.status === 200) {
      let searchResult = this.response;
      let title = searchResult.Title;
      let poster = searchResult.Poster;
      let imdbID = searchResult.imdbID;
      let galleryHTML = `
      <li class="list__item">
        <a class="list__content" href="${imdbID}" title="${title}">
          <img id="${imdbID}" src="${poster}" alt="${title}"/>
        </a>
      </li>
      `;
      gallery.insertAdjacentHTML('beforeend',galleryHTML);
    }
  }
};
function sofianFavorites(){
  let myMovies = ['tt0119116','tt0414993','tt2015381','tt0468569','tt0119174','tt1568346','tt0347149','tt2488496'];
  for (let i=0; i < myMovies.length; i++){
    const movie = myMovies[i];
    const url = `https://www.omdbapi.com/?i=${movie}`;
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

gallery.addEventListener('click', (e)=>{
  e.preventDefault();
  let imdbID = e.target.id;
  let modal = new Custombox.modal({
    content: {
      fullscreen: true,
      effect: 'fadein',
      target: '#modal__'+imdbID
    },
    loader: {
      active: true,
      color: '#000',
      speed: 1500,
    }
  });
  modal.open();
});
