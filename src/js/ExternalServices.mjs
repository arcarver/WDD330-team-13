const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    // No longer need category or path in constructor
  }

  getFullUrlForCategory(category) {
    if (!!baseURL) {
      return `${baseURL}products/search/${category}`;
    } else {
      return `/json/${category}.json`;
    }
  }

  async getData(category) {
    const response = await fetch(this.getFullUrlForCategory(category));
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    if (!!baseURL) {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result;
    } else {
      const bags = await this.getData('sleeping-bags');
      return bags.find((bag) => { return bag.Id == id });
    }
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    };

    const response = await fetch(`${baseURL}checkout`, options);
    return await convertToJson(response);
  }
}
