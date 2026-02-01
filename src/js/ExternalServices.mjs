const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: 'servicesError', message: data };
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
      body: JSON.stringify(payload),
    }
      try {} catch(err) {
        try { }
        
        document.querySelector('#chekcoutSubmit')
          .addEventListener('click', (e) => {
            e.preventDefault();
            const myForm = document.forms[0];
            const chk_status = myForm.checkValidity();
            myForm.reportValitity();
            if (chk_status)
             
            myCheckout.checkout();
        })
      };

    return await fetch (`${baseURL}checkout`, options).then(convertToJson);
  }
}
