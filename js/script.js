let artist = "";
let searched = document.getElementById('searched');
let hideSearch = document.getElementById('hideSearch');
let ul = document.getElementById('collect');
let player = document.getElementById('player');
let embed = document.getElementById('embed');
let uriStr = "https://embed.spotify.com/?uri=";
let scrolly = document.getElementsByClassName('scrolly')[0];
let currentSimArt = "";
let id = "";
let genre = "";
let simArtArray = [];
let simArtPopSongsArray = [];

// Stores artist name input in localStorage
let form = document.getElementById('form');
form.addEventListener("submit", function() {
  localStorage.setItem('artist', searched.value.trim());
});

searched.value = localStorage.getItem('artist');
artist = searched.value;

// Fetch Call Functions
function fetchArtist(artist) {
  let url = `https://api.spotify.com/v1/search?q=${artist}&type=artist`;
  return fetch(url)
    .then(function(pObj) {
      return pObj.json();
    })
    .then(function(json) {
      id = json.artists.items[0].id;
      genre = json.artists.items[0].genres[0];
      return json.artists.items[0];
    })
    .catch(function(error) {
      title.innerText = "Try Another Artist";
      console.log(error);
      throw error;
    });
}

function fetchSimArt() {
  let url = `https://api.spotify.com/v1/artists/${id}/related-artists`;
  return fetch(url)
    .then(function(pObj) {
      return pObj.json();
    })
    .then(function(json) {
      json.artists.sort(function(a, b) {
        return a.popularity - b.popularity;
      });
      simArtArray = json.artists;
      return json.artists;
    })
    .catch(function(error) {
      console.log(error);
      throw error;
    });
}

function fetchSimArtPopSongs(name, simArtId, imgURL) {
  let url = `https://api.spotify.com/v1/artists/${simArtId}/top-tracks?country=US`;
  fetch(url)
    .then(function(pObj) {
      return pObj.json();
    })
    .then(function(json) {
      title.innerText = name;
      while (ul.hasChildNodes()) {
        ul.removeChild(ul.lastChild);
      }
      simArtPopSongsArray = json.tracks;
      let array = json.tracks;
      for (let i = 0; i < array.length; i++) {
        collectNode(i);
        let liNum = document.getElementById(i);
        liNum.children[0].src = imgURL;
        liNum.children[1].innerHTML = `${i + 1}. &nbsp; ${array[i].name}`;
        liNum.children[2].innerText = "Select Song";
      }
      embed.src = uriStr + array[0].uri;
      if(player.hasAttribute('hidden')) {
        player.removeAttribute('hidden');
      }
      if(hideSearch.hasAttribute('hidden')) {
        hideSearch.removeAttribute('hidden');
      }
      addSelectSongsListeners();
      return json.tracks;
    })
    .catch(function(error) {
      console.log(error);
      throw error;
    });
}

function fetchSimAlb() {

}

function fetchSimAlbPopSongs() {

}

function fetchNewRel() {

}

function fetchNewRelSongs() {

}

// Display Functions
let promInit = fetchArtist(artist);
displaySimArt();

function displaySimArt() {
  let promSimArt = Promise.resolve(promInit)
    .then(function() {
      let title = document.getElementById('title');
      title.innerText = "Similar Artists";
      let simArtists = fetchSimArt();
      simArtists.then(function(array) {
        for (let i = 0; i < 10; i++) {
          collectNode(i);
          let liNum = document.getElementById(i);
          if (array[i].images.length !== 0) {
            liNum.children[0].src = array[i].images[1].url;
          }
          liNum.children[1].innerHTML = `${i + 1}. &nbsp; ${array[i].name}`;
          liNum.children[2].innerText = "View Songs";
        }
        addViewSongsListeners();
      });
    })
    .catch(function(error) {
      console.log(error);
      throw error;
    });
}

// Collection Node Creator
function collectNode(num) {
  let li = document.createElement('li');
  li.id = num;
  li.className = "collection-item avatar";
  let img = document.createElement('img');
  img.src = "";
  img.className = "circle";
  li.appendChild(img);
  let h4 = document.createElement('h4');
  h4.className = "title";
  li.appendChild(h4);
  let button = document.createElement('button');
  button.className = "secondary-content btn";
  li.appendChild(button);
  ul.appendChild(li);
}

// Body Button Event Listeners
function addViewSongsListeners() {
  let btnArray = document.getElementsByClassName('secondary-content');
  for (let i = 0; i < btnArray.length; i++) {
    btnArray[i].addEventListener("click", function() {
      Promise.resolve(simArtArray)
        .then(function(array) {
          currentSimArt = array[i].name;
          let promArray = fetchSimArtPopSongs(array[i].name, array[i].id, array[i].images[1].url);
          sideArtBtn.className = "btn-large";
          scrolly.scrollTop = 0;
        });
    });
  }
}

function addSelectSongsListeners() {
  let btnArray = document.getElementsByClassName('secondary-content');
  for (let i = 0; i < btnArray.length; i++) {
    btnArray[i].addEventListener("click", function() {
      Promise.resolve(simArtPopSongsArray)
        .then(function(array) {
          embed.src = uriStr + array[i].uri;
        });
    });
  }
}

let searchCeption = document.getElementById('searchCeption');
searchCeption.addEventListener("click", function() {
  searched.value = currentSimArt;
  searched.onsubmit();
  hideSearch.setAttribute('hidden', '');
});

// Sidebar Event Listeners
let sideHomeBtn = document.getElementById('home');
sideHomeBtn.addEventListener("click", function () {
  self.location = "index.html";
  localStorage.setItem('artist', '');

});

let sideArtBtn = document.getElementById('sideArt');
sideArtBtn.addEventListener("click", function () {
  sideArtBtn.className += " disabled";
  sideAlbBtn.className = "btn-large";
  sideNewBtn.className = "btn-large";
  hideSearch.setAttribute("hidden", "");
  while (ul.hasChildNodes()) {
    ul.removeChild(ul.lastChild);
  }
  displaySimArt();

});

let sideAlbBtn = document.getElementById('sideAlb');
sideAlbBtn.addEventListener("click", function () {
  sideArtBtn.className = "btn-large";
  sideAlbBtn.className += " disabled";
  sideNewBtn.className = "btn-large";

});

let sideNewBtn = document.getElementById('sideNew');
sideNewBtn.addEventListener("click", function () {
  sideArtBtn.className = "btn-large";
  sideAlbBtn.className = "btn-large";
  sideNewBtn.className += " disabled";

});
