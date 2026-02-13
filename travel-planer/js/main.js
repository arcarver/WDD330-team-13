import { getAttractions } from "./api.js";
import { displayResults, displayFavorites } from "./ui.js";

document.getElementById("searchBtn").addEventListener("click", searchCity);
document.getElementById("searchInput").addEventListener("keypress", e => {
  if (e.key === "Enter") searchCity();
});

async function searchCity() {
  const city = document.getElementById("searchInput").value;
  const data = await getAttractions(city);
  displayResults(data);
}

displayFavorites();
