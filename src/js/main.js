import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import Alert from './Alert.js';

loadHeaderFooter();

setTimeout(() => {
  updateCartCount();
}, 100);

const alert = new Alert();
alert.displayAlerts();
