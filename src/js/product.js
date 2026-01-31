import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import { getParam } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

loadHeaderFooter();

setTimeout(() => {
  updateCartCount();
}, 100);

const productId = getParam('product');

const dataSource = new ExternalServices();

const product = new ProductDetails(productId, dataSource);
product.init().then(updateBreadcrumbs);

async function updateBreadcrumbs() {
  const breadcrumbElem = document.getElementById('breadcrumbs');
  if (!breadcrumbElem) return;
  let prod = product.product;
  if (!prod || !prod.Category) {
    prod = await dataSource.findProductById(productId);
  }
  if (prod && prod.Category) {
    const formattedName =
      prod.Category === 'sleeping-bags'
        ? 'Sleeping Bags'
        : prod.Category.charAt(0).toUpperCase() + prod.Category.slice(1);
    breadcrumbElem.innerHTML = `
      <a href="../index.html">Home</a>
      <span class="crumb-sep">&rarr;</span>
      <a href="../product_listing/?category=${encodeURIComponent(prod.Category)}">${formattedName}</a>
    `;
  } else {
    breadcrumbElem.innerHTML = '';
  }
}
