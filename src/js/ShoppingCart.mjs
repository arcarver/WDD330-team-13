import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

export default class ShoppingCart {
    constructor(storageKey, parentElement) {
        this.storageKey = storageKey;
        this.parentElement = parentElement;
    }

    get cartItems() {
        // if nothing in localStorage, return empty array
        return getLocalStorage(this.storageKey) ?? [];
    }

    cartItemTemplate(item) {
        return `<li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
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
        // Clear and re-render with the shared helper
        renderListWithTemplate(
            this.cartItemTemplate.bind(this),
            this.parentElement,
            this.cartItems,
            "afterbegin",
            true
        );

        // Optional UX: show message if cart empty
        if (this.cartItems.length === 0) {
            this.parentElement.insertAdjacentHTML(
                "afterbegin",
                `<li class="divider">Your cart is empty.</li>`
            );
        }
    }

    init() {
        this.render();
    }
}
