import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
    const isDiscounted = product.SuggestedRetailPrice && product.FinalPrice < product.SuggestedRetailPrice;
    const discountPercent = isDiscounted ? Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100) : 0;

    return `<li class="product-card">
    <a href="../product_pages/?product=${product.Id}">
      ${isDiscounted ? `<div class="discount-badge">${discountPercent}% OFF</div>` : ''}
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}">
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <div class="price-container">
        ${isDiscounted ? `<p class="product-card__price--original">$${product.SuggestedRetailPrice}</p>` : ''}
        <p class="product-card__price">$${product.FinalPrice}</p>
      </div>
    </a>
  </li>`;
}

export default class ProductList {
    constructor(category, dataSource, listElement) {
        // You passed in this information to make the class as reusable as possible.
        // Being able to define these things when you use the class will make it very flexible
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        // the dataSource will return a Promise...so you can use await to resolve it.
        const list = await this.dataSource.getData(this.category);
        // render the list of products
        this.renderList(list);
    }

    renderList(list) {
        renderListWithTemplate(productCardTemplate, this.listElement, list);
    }
}