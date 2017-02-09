let artist = "";
let searched = document.getElementById('searched');
let ul = document.getElementById("collect");

// Stores artist name input in localStorage
let form = document.getElementById('form');
form.addEventListener("submit", function() {
  localStorage.setItem('artist', searched.value.trim());
});

searched.value = localStorage.getItem('artist');
artist = searched.value;
