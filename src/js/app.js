"use strict"

let gallery = document.querySelector('#js__list');
let footer = document.querySelector('#js__footer');


//
// Ajax call to get Movies from omdb api
//

let searchButton = document.querySelector('#js__button');

searchButton.addEventListener('click', (e)=>{

  console.log(e.target.previousElementSibling.value);
  let searchText = e.target.previousElementSibling;
  if(searchText.value){
    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }
    let search= searchText.value.split(' ').join('+');
    const url = `http://www.omdbapi.com/?s=${search}&type=movie`;
    console.log(url);

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          console.log(xhr.response);
          if(xhr.response.Error === "Movie not found!"){
            swal({
              title: "Movie not found",
              text: "Please check for typo's and try again",
              type: "error",
              confirmButtonColor: "#2a3d45",
            });
          }else{
            let json = xhr.response.Search;
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


              const url = `http://www.omdbapi.com/?i=${imdbID}`;
              let xhr2 = new XMLHttpRequest();
              xhr2.open('GET', url, true);
              xhr2.responseType = 'json';
              xhr2.onload = function () {
                if (xhr2.readyState === xhr2.DONE) {
                  if (xhr2.status === 200) {
                    let json2 = xhr2.response;
                    let searchResult = json2;
                    let categorie = searchResult.Genre;
                    let plot = searchResult.Plot;
                    let title = searchResult.Title;
                    let year = searchResult.Year;
                    let poster = searchResult.Poster;
                    let posterImage ='';
                    if(poster === 'N/A'){
                      posterImage =`<svg class="icons">
                      <use id="${imdbID}"  xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="./img/sprite/sprite.svg#icons--popcorn"></use>
                    </svg>`
                  }else {
                    posterImage =`<img id="${imdbID}" src="${poster}" alt="${title}"/>`
                  }
                  let modalHTML = `
                  <div id="modal__${imdbID}" class="modal">
                    <button type="button" class="button__modal" onclick="Custombox.modal.closeAll();">Back</button>
                    ${posterImage}
                    <h1>${title}</h1>
                    <p>${plot}</p>
                    <span>Year: </span><span>${year}</span>
                    <span>Categorie: </span><span>${categorie}</span>
                  </div>
                  `;
                  footer.insertAdjacentHTML('afterend',modalHTML);
                }
              }
            }
            xhr2.send(null);
          }
        }
      }
    }
  };

  xhr.send(null);
  searchText.value ='';
}
});

// Open
gallery.addEventListener('click', (e)=>{
  e.preventDefault();
  console.log(e.target);
  console.log(e.target.id);
  let imdbID = e.target.id;
  // Instantiate new modal
  var modal = new Custombox.modal({
    content: {
      fullscreen: true,
      effect: 'fadein',
      target: '#modal__'+imdbID
    }
  });
  modal.open();
});
