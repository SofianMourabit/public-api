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
          let oReq = new XMLHttpRequest();
          oReq.responseType = 'json';
          oReq.addEventListener('load', createModals);
          oReq.open("get", url, true);
          oReq.send();
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
      let year = searchResult.Year;
      let poster = searchResult.Poster;
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
          <span>Year: </span><span>${year}</span><br>
            <span>Genre: </span><span>${genre}</span>
          </div>
        </div>
      </div>
      `;
      footer.insertAdjacentHTML('afterend',modalHTML);
    }
  }
};

function ajaxCall(){
  console.log('triggered');
  let searchText = document.querySelector('.search__input');
  if(searchText.value){
    emptyGallery(gallery);
    let search = searchText.value.split(' ').join('+');
    const url = `https://www.omdbapi.com/?s=${search}&type=movie`;

    let oReq = new XMLHttpRequest();
    oReq.responseType = 'json';
    oReq.addEventListener('load', createGallery);
    oReq.open("get", url, true);
    oReq.send();
    searchText.value ='';
  }
}

//
// Add event listener to search input and button
//

searchButton.addEventListener('click', ajaxCall);
searchButton.previousElementSibling.addEventListener('change', ajaxCall);

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
