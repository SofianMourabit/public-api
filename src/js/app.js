//
// CustomBox Plugin (Vanilla JS)
//




let gallery = document.querySelector('#js__list');
let footer = document.querySelector('#js__footer');


//
// Vanilla JS search box
//

let searchBox = document.querySelector('.search__input');
let a = document.querySelectorAll('.list__content');
searchBox.addEventListener("keyup", () => {
  let inputText = search.value.toLowerCase();
  let j = 0;
  for(let i=0; i < a.length; i++ ) {
    let captionText = a[i].getAttribute("title").toLowerCase();
    if (captionText.includes(inputText)){
      a[i].parentElement.style.display = "block";
    }else{
      a[i].parentElement.style.display = "none";
    }
  }
});

//
// Ajax call to get Movies from omdb api
//

let searchButton = document.querySelector('#js__button');

searchButton.addEventListener('click', (e)=>{
  console.log(e.target.previousElementSibling.value);
  let searchText = e.target.previousElementSibling.value;
  let search= searchText.split(' ').join('+');
  const url = `http://www.omdbapi.com/?s=${search}&type=movie`;
  console.log(url);

  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function () {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        let json = xhr.response.Search;
        for(let i = 0; i < json.length; i++) {
          let searchResult = json[i];
          let title = searchResult.Title;
          let type = searchResult.Type;
          let poster = searchResult.Poster;
          let imdbID = searchResult.imdbID;
          let galleryHTML = `
          <li class="list__item">
            <a class="list__content" href="${imdbID}" title="${title}">
              <img id="${imdbID}" src="${poster}" alt="${title}"/>
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
                let modalHTML = `
                <div id="modal__${imdbID}" class="modal">
                  <button type="button" class="button__modal" onclick="Custombox.modal.closeAll();">Back</button>
                  <img id="${imdbID}" src="${poster}" alt="${title}"/>
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
  };

  xhr.send(null);

});

// Open
gallery.addEventListener('click', (e)=>{
  e.preventDefault();
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


//
// Localstorage for saving images
//
if (localStorageSupport()) {
  // localStorage.setItem('image', );
  // let moviePicture = eval(localStorage.getItem('image'));
}

function localStorageSupport() {
  return (('localStorage' in window) && window['localStorage'] !== null)
}
