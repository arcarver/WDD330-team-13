import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    calculateItemSubTotal() {
        // Calculate subtotal and item count
        this.itemTotal = this.list.reduce((sum, item) => sum + (parseFloat(item.FinalPrice) || 0), 0);
        const itemCount = this.list.length;
        // Display subtotal and item count
        const subtotalElem = document.querySelector(`${this.outputSelector} #summary-subtotal`);
        if (subtotalElem) subtotalElem.textContent = `$${this.itemTotal.toFixed(2)}`;
        const itemCountElem = document.querySelector(`${this.outputSelector} #item-count`);
        if (itemCountElem) itemCountElem.textContent = itemCount;
    }

    calculateOrderTotal() {
        // Calculate tax and shipping
        this.tax = +(this.itemTotal * 0.06).toFixed(2);
        this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
        this.orderTotal = +(this.itemTotal + this.tax + this.shipping).toFixed(2);
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        // Display tax, shipping, and total
        const taxElem = document.querySelector(`${this.outputSelector} #summary-tax`);
        if (taxElem) taxElem.textContent = `$${this.tax.toFixed(2)}`;
        const shippingElem = document.querySelector(`${this.outputSelector} #summary-shipping`);
        if (shippingElem) shippingElem.textContent = `$${this.shipping.toFixed(2)}`;
        const totalElem = document.querySelector(`${this.outputSelector} #summary-total`);
        if (totalElem) totalElem.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
}
