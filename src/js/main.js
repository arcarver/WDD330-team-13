import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import Alert from './Alert.js';

loadHeaderFooter();

// Update cart count after header loads
setTimeout(() => {
  updateCartCount();
}, 100);

// Create and display alerts
const alert = new Alert();
alert.displayAlerts();
