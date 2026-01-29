// Add event listener to Checkout button to navigate to checkout page
document.addEventListener('DOMContentLoaded', () => {
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.location.href = '/checkout/index.html';
    });
  }
});
import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import ShoppingCart from './ShoppingCart.mjs';

loadHeaderFooter();

const listElement = document.querySelector('.product-list');

const cart = new ShoppingCart('so-cart', listElement);
cart.init();

// Update cart count after loading the header
setTimeout(() => {
  updateCartCount();
}, 100);
