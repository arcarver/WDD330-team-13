import ProductData from "./ProductData.mjs";
const productInfo = new ProductData('tents');

import ProductList from "./ProductList.mjs";
const productListElements = document.getElementsByClassName('product-list');
var products = new ProductList('tents', productInfo, productListElements[0]);
products.init();
