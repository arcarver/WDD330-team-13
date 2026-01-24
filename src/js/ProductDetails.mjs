import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.dataSource = dataSource;
        this.product = {};
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);

        if (!this.product) {
            console.error('Product not found for id:', this.productId);
            return;
        }

        this.renderProductDetails();

        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cart = getLocalStorage('so-cart') ?? [];
        cart.push(this.product);
        setLocalStorage('so-cart', cart);
        updateCartCount();
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
    }
}

function productDetailsTemplate(product) {
    document.querySelector('h2').textContent = product.Brand.Name;
    document.querySelector('h3').textContent = product.NameWithoutBrand;

    const productImage = document.getElementById('productImage');
    productImage.src = product.Images.PrimaryLarge;
    productImage.alt = product.NameWithoutBrand;

    // Handle discount pricing
    const priceElement = document.getElementById('productPrice');
    const isDiscounted = product.SuggestedRetailPrice && product.FinalPrice < product.SuggestedRetailPrice;
    
    if (isDiscounted) {
        const discountPercent = Math.round(((product.SuggestedRetailPrice - product.FinalPrice) / product.SuggestedRetailPrice) * 100);
        priceElement.innerHTML = `
            <div class="price-container">
                <div class="discount-badge">${discountPercent}% OFF</div>
                <p class="product-card__price--original">$${product.SuggestedRetailPrice}</p>
                <p class="product-card__price">$${product.FinalPrice}</p>
            </div>
        `;
    } else {
        priceElement.innerHTML = `<p class="product-card__price">$${product.FinalPrice}</p>`;
    }

    document.getElementById('productColor').textContent = product.Colors[0].ColorName;
    document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

    document.getElementById('addToCart').dataset.id = product.Id;
}
