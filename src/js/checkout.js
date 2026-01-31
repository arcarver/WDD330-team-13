import { loadHeaderFooter, updateCartCount, alertMessage } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

setTimeout(() => {
  updateCartCount();
}, 100);

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

      const checkoutProcess = new CheckoutProcess('so-cart', '.order-summary');
      checkoutProcess.init();
      const response = await checkoutProcess.checkout(form);
      if (response && !response.error) {
        localStorage.removeItem('so-cart');
        window.location.href = './success.html';
      } else {
        let msg = 'Order failed: ';
        if (response && response.message) {
          if (
            typeof response.message === 'object' &&
            response.message !== null
          ) {
            const details = Object.entries(response.message)
              .map(
                ([field, error]) =>
                  `${field.replace(/([A-Z])/g, ' $1')}: ${error}`,
              )
              .join('<br>');
            msg += `<br>${details}`;
          } else {
            msg += response.message;
          }
        } else {
          msg += 'Unknown error';
        }
        alertMessage(msg);
      }
    });
  }

  const checkout = new CheckoutProcess('so-cart', '.order-summary');
  checkout.init();

  const zipInput = document.getElementById('zip');
  if (zipInput) {
    zipInput.addEventListener('blur', () => {
      if (zipInput.value.trim() !== '') {
        checkout.calculateOrderTotal();
      }
    });
  }
});
