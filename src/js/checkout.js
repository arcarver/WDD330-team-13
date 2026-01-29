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
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        document.getElementById('form-error').style.display = 'block';
        return;
      } else {
        document.getElementById('form-error').style.display = 'none';
      }
      // Call checkout and log response
      const checkoutProcess = new CheckoutProcess('so-cart', '.order-summary');
      checkoutProcess.init();
      const response = await checkoutProcess.checkout(form);
      // Show user feedback
      let msg = '';
      if (response && !response.error) {
        msg = 'Order submitted successfully!';
      } else {
        msg =
          'Order failed: ' +
          (response && response.message ? response.message : 'Unknown error');
      }
      let feedback = document.getElementById('checkout-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.id = 'checkout-feedback';
        feedback.style.margin = '1em 0';
        feedback.style.fontWeight = 'bold';
        form.appendChild(feedback);
      }
      feedback.textContent = msg;
      feedback.style.color = response && !response.error ? 'green' : 'red';
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
