var id = "";
var genre = "";
var mainArtist = searchArtist();
console.log(mainArtist);

var search = document.getElementById('search');
// var artist = search.innerText;
var artist = "Senses Fail";


function searchArtist(artist) {
  var url = `https://api.spotify.com/v1/search?q=${artist}&type=artist`;
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
      console.log(error);
      throw error;
    });
}

function displaySimArt() {
  var url = `https://api.spotify.com/v1/artists/${id}/related-artists`;
  fetch(url)
    .then(function(pObj) {
      return pObj.json();
    })
    .then(function(json) {
      console.log(json);
      return json;
    })
    .catch(function(error) {
      console.log(error);
      throw error;
    });
}

function displaySimArtPopSongs() {

}

function displaySimAlb() {

}

function displaySimAlbPopSongs() {

}

function displayNewRel() {

}

function displayNewRelSongs() {

}




var promInit = searchArtist(artist);

var promSimArt = Promise.resolve(promInit)
  .then(function() {
    displaySimArt();
});

var promSimArtPopSongs = Promise.resolve(promSimArt)
  .then(function() {
    displaySimArtPopSongs();
});

var promSimAlb = Promise.resolve(promInit)
  .then(function() {
    displaySimAlb();
});

var promSimAlbPopSongs = Promise.resolve(promSimArtPopSongs)
  .then(function() {
    displaySimAlbPopSongs();
});

var promNewRel = Promise.resolve(promInit)
  .then(function() {
    displayNewRel();
});

var promNewRelSongs = Promise.resolve(promNewRel)
  .then(function() {
    displayNewRelSongs();
});
