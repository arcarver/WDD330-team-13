export function saveFavorite(place) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(place);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

export function removeFavorite(index) {
  let favorites = getFavorites();
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}
