// =========================
// 🔐 KEYS (PON LAS TUYAS)
// =========================

const AMADEUS_API_KEY = "YSqELmAhv2b1DCT7Rdg17JGOcfAtsXSX";
const AMADEUS_API_SECRET = "v0lhUCM6h5kAUjAC";
const YELP_API_KEY = "TU_API_KEY_DE_YELP";

// Proxy para evitar CORS
const proxy = "https://cors-anywhere.herokuapp.com/";

// =========================
// 🟢 OBTENER TOKEN AMADEUS
// =========================
async function getAmadeusToken() {
  const url = "https://test.api.amadeus.com/v1/security/oauth2/token";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`
  });

  const data = await response.json();
  return data.access_token;
}

// =========================
// ✈️ DESTINOS DESDE CIUDAD (AMADEUS)
// =========================
export async function getDestinations(originCityCode) {
  const token = await getAmadeusToken();

  const url = `https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${originCityCode}&maxPrice=500`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();
  return data.data; // array de destinos
}

// =========================
// 🏨 ATRACCIONES Y RESTAURANTES (YELP)
// =========================
export async function getAttractions(city) {
  const url = `${proxy}https://api.yelp.com/v3/businesses/search?location=${city}&categories=attractions,restaurants&limit=10`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${YELP_API_KEY}`
    }
  });

  const data = await response.json();
  return data.businesses;
}
