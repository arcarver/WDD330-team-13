
import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';


loadHeaderFooter();

// Update cart count after header loads
setTimeout(() => {
  updateCartCount();
}, 100);


// Form validation and order summary using CheckoutProcess
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        document.getElementById('form-error').style.display = 'block';
      } else {
        document.getElementById('form-error').style.display = 'none';
      }
    });
  }

  // Use CheckoutProcess for order summary
  const checkout = new CheckoutProcess('so-cart', '.order-summary');
  checkout.init();

  // Calculate totals after zip code is filled
  const zipInput = document.getElementById('zip');
  if (zipInput) {
    zipInput.addEventListener('blur', () => {
      if (zipInput.value.trim() !== '') {
        checkout.calculateOrderTotal();
      }
    });
  }
});
