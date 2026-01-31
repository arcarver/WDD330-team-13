import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

export default class ShoppingCart {
    constructor(storageKey, parentElement) {
        this.storageKey = storageKey;
        this.parentElement = parentElement;
    }

    get cartItems() {
        return getLocalStorage(this.storageKey) ?? [];
    }

    cartItemTemplate(item) {
        const imageUrl = item.Images?.PrimaryMedium || item.Image || '';
        return `<li class="cart-card divider">
            <span class="cart-card__remove" data-id="${item.Id || item.id || item.productId}" title="Remove from cart">&times;</span>
            <a href="#" class="cart-card__image">
                <img src="${imageUrl}" alt="${item.Name}" />
            </a>
            <a href="#">
                <h2 class="card__name">${item.Name}</h2>
            </a>
            <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
            <p class="cart-card__quantity">qty: 1</p>
            <p class="cart-card__price">$${item.FinalPrice}</p>
        </li>`;
    }

    render() {
        renderListWithTemplate(
            this.cartItemTemplate.bind(this),
            this.parentElement,
            this.cartItems,
            "afterbegin",
            true
        );

        this.parentElement.querySelectorAll('.cart-card__remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                console.log('Remove clicked for id:', id);
                this.removeItem(id);
            });
        });

        if (this.cartItems.length === 0) {
            this.parentElement.insertAdjacentHTML(
                "afterbegin",
                `<li class="divider">Your cart is empty.</li>`
            );
            const footer = document.querySelector('.cart-footer');
            if (footer) footer.classList.add('hide');
        } else {
            const footer = document.querySelector('.cart-footer');
            if (footer) footer.classList.remove('hide');
            const prices = document.getElementsByClassName('cart-card__price');
            const total = Array.from(prices).reduce((accumulator, currentValue) => {
                const value = parseFloat(currentValue.innerText.replace(/[^0-9.]+/g, '')) || 0;
                return accumulator + value;
            }, 0);
            const totalElem = document.querySelector('.cart-total');
            if (totalElem) totalElem.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    removeItem(id) {
        console.log('Cart items before removal:', this.cartItems.map(item => item.Id || item.id || item.productId));
        const items = this.cartItems.filter(item => String(item.Id || item.id || item.productId) !== String(id));
        localStorage.setItem(this.storageKey, JSON.stringify(items));
        this.render();
    }
    init() {
        this.render();
    }
}
