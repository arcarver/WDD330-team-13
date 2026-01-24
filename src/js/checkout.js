import { loadHeaderFooter, updateCartCount } from './utils.mjs';

loadHeaderFooter();

// Update cart count after header loads
setTimeout(() => {
  updateCartCount();
}, 100);
