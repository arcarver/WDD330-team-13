import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};
    formData.forEach((value, key) => {
        convertedJSON[key] = value;
    });
    return convertedJSON;
}

function packageItems(items) {
    return (items || []).map((item) => ({
        id: item.Id || item.id || item.productId,
        name: item.Name || item.name || item.title,
        price: parseFloat(item.FinalPrice ?? item.price ?? 0),
        quantity: parseInt(item.quantity ?? 1, 10) || 1
    }));
}

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

    async checkout(form) {
        try {
            // Convert expiration from YYYY-MM to MM/YY if needed
            const orderData = formDataToJSON(form);
            if (orderData.expiration && orderData.expiration.includes('-')) {
                const [year, month] = orderData.expiration.split('-');
                orderData.expiration = `${month}/${year.slice(-2)}`;
            }
            if (!this.list || this.list.length === 0) {
                return { error: true, message: "Cart is empty." };
            }

            this.calculateItemSubTotal();
            this.calculateOrderTotal();

            orderData.orderDate = new Date().toISOString();
            orderData.orderTotal = this.orderTotal.toFixed(2);
            orderData.tax = this.tax.toFixed(2);
            orderData.shipping = this.shipping;
            orderData.items = packageItems(this.list);

            console.log('ORDER PAYLOAD TO SERVER:', orderData);

            const response = await services.checkout(orderData);
            return response;
        } catch (err) {
            // Surface error details for UI
            return { error: true, message: err.message || "Checkout failed." };
        }
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
        const taxElem = document.querySelector(`${this.outputSelector} #tax`);
        if (taxElem) taxElem.textContent = `$${this.tax.toFixed(2)}`;
        const shippingElem = document.querySelector(`${this.outputSelector} #shipping`);
        if (shippingElem) shippingElem.textContent = `$${this.shipping.toFixed(2)}`;
        const totalElem = document.querySelector(`${this.outputSelector} #orderTotal`);
        if (totalElem) totalElem.textContent = `$${this.orderTotal.toFixed(2)}`;
    }
}
