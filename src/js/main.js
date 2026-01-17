import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import Alert from './Alert.js';

// Create and display alerts
const alert = new Alert();
alert.displayAlerts();

// Create data source
const dataSource = new ProductData('tents');

// Get the list element from the DOM
const listElement = document.querySelector('.product-list');

// Create and initialize product list
const productList = new ProductList('tents', dataSource, listElement);
productList.init();
