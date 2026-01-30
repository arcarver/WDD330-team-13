// success.js
// This file is intentionally left blank for now.
// You can add custom logic for the success page if needed, such as loading header/footer or showing order details.
import { loadHeaderFooter } from '../js/utils.mjs';

loadHeaderFooter();

// Redirect to home after showing success message for 3 seconds
setTimeout(() => {
    window.location.href = '../index.html';
}, 3000);
