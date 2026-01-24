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
