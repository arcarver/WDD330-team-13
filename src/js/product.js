import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import { getParam } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductDetails from './ProductDetails.mjs';

loadHeaderFooter();

// Update cart count after header loads
setTimeout(() => {
  updateCartCount();
}, 100);

const productId = getParam('product');

const dataSource = new ExternalServices();

const product = new ProductDetails(productId, dataSource);
product.init();
