import { loadHeaderFooter, updateCartCount } from './utils.mjs';
import { getParam } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

loadHeaderFooter();

// Update cart count after header loads
setTimeout(() => {
  updateCartCount();
}, 100);

const productId = getParam('product');

const dataSource = new ProductData();

const product = new ProductDetails(productId, dataSource);
product.init();
