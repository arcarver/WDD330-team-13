import { saveFavorite, getFavorites, removeFavorite } from "./storage.js";

export function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  data.forEach((place, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const image = place.image_url || "https://via.placeholder.com/300";

    card.innerHTML = `
      <img src="${image}" alt="${place.name}" class="card-img">
      <h3>${place.name}</h3>
      <p>⭐ Rating: ${place.rating}</p>
      <p>📍 ${place.location.address1}</p>
      <p>🍽️ Category: ${place.categories[0].title}</p>
      <p>💲 Price: ${place.price || "N/A"}</p>
      <p>📞 ${place.phone || "N/A"}</p>
      <button>Save</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      saveFavorite(place);
      displayFavorites();
    });

    resultsDiv.appendChild(card);
  });
}

export function displayFavorites() {
  const favoriteDiv = document.getElementById("favoriteList");
  favoriteDiv.innerHTML = "";

  const favorites = getFavorites();

  favorites.forEach((place, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${place.image_url}" class="card-img">
      <h3>${place.name}</h3>
      <p>${place.location.address1}</p>
      <button>Remove</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      removeFavorite(index);
      displayFavorites();
    });

    favoriteDiv.appendChild(card);
  });
}
