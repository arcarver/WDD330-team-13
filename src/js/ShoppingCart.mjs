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
        // Handle both API response format and local JSON format
        const imageUrl = item.Images?.PrimaryMedium || item.Image || '';
        return `<li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imageUrl}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
      <div>
      <input type="int" class="cart-card__quantity" value="1">
      <label class="cart-card__quantity>
      <button class=cart-quantity__update" id="update_button" type="button">Update</button></div>
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
            // Hide the cart-footer if empty
            const footer = document.querySelector('.cart-footer');
            if (footer) footer.classList.add('hide');
        } else {
            // Show the cart-footer if there are items
            const footer = document.querySelector('.cart-footer');
            if (footer) footer.classList.remove('hide');
            const prices = document.getElementsByClassName('cart-card__price');
            const total = Array.from(prices).reduce((accumulator, currentValue) => {
                const value = parseFloat(currentValue.innerText.replace(/[^\d.]/g, '')) || 0;
                return accumulator + value;
            }, 0);
            const totalElem = document.querySelector('.cart-total');
            if (totalElem) totalElem.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    init() {
        this.render();
    }
}
