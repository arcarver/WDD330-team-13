import { getLocalStorage, setLocalStorage, renderListWithTemplate, updateCartCount } from "./utils.mjs";

export default class ShoppingCart {
    constructor(storageKey, parentElement) {
        this.storageKey = storageKey;
        this.parentElement = parentElement;
    }

    get cartItems() {
        // if nothing in localStorage, return empty array
        const items = getLocalStorage(this.storageKey) ?? [];
        let countedItems = [];
        items.forEach((item) => {
            let existingItem = countedItems.find((countedItem) => {
                return countedItem.Id === item.Id;
            });
            if (existingItem) {
                existingItem.Quantity += 1;
            } else {
                item.Quantity = 1;
                countedItems.push(item);
            }
        });

        return countedItems;
    }

    cartItemTemplate(item) {
        const imageUrl = item.Images?.PrimaryMedium || item.Image || '';
        const quantity = item.Quantity;
        return `<li class="cart-card divider" id="${item.Id}">
            <a href="#" class="cart-card__image">
                <img src="${imageUrl}" alt="${item.Name}" />
            </a>
            <a href="#">
                <h2 class="card__name">${item.Name}</h2>
            </a>
            <p class="cart-card__color">${item.Colors?.[0]?.ColorName ?? ""}</p>
            <div class="cart-card__controls">
                <input type="int" id="item_count" class="cart-card__quantity" value="${quantity}" style="width: 2.5em; text-align: center;">
                <button class="cart-quantity__update" id="update_button" type="button" style="height: 2em;">Update</button>
                <button class="cart-card__remove" id="remove_button_${item.Id}" type="button" title="Remove from cart">&times;</button>
            </div>
            <p class="cart-card__price">$${item.FinalPrice * quantity}</p>
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

        // Update quantity buttons
        const buttons = document.querySelectorAll('#update_button');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const countedCart = this.cartItems;
                const id = button.parentElement.parentElement.id;
                const newQuantity = Number(button.parentElement.querySelector('#item_count').value);
                const existingElement = countedCart.find((item) => { return item.Id === id });
                let existingQuantity = existingElement.Quantity;
                existingElement.Quantity = undefined;
                if (existingQuantity < newQuantity) {
                    const cart = getLocalStorage(this.storageKey) ?? [];
                    while (existingQuantity < newQuantity) {
                        cart.push(existingElement);
                        existingQuantity++;
                    }
                    setLocalStorage(this.storageKey, cart);
                    this.render();
                    updateCartCount();
                } else if (existingQuantity > newQuantity) {
                    const cart = getLocalStorage(this.storageKey) ?? [];
                    while (existingQuantity > newQuantity) {
                        const lastIndex = cart.findLastIndex((item) => { return item.Id === id });
                        cart.splice(lastIndex, 1);
                        existingQuantity--;
                    }
                    setLocalStorage(this.storageKey, cart);
                    this.render();
                    updateCartCount();
                }
            });
        });

        // Remove buttons (attach like update button)
        const removeButtons = document.querySelectorAll('.cart-card__remove');
        removeButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const id = button.parentElement.parentElement.id;
                this.removeItem(id);
                updateCartCount();
            });
        });

        // Optional UX: show message if cart empty
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
