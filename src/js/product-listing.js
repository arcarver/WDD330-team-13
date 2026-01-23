import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam } from './utils.mjs';

loadHeaderFooter();

const category = getParam('category');

// Update the page title based on category
function updateTitle(category) {
    const titleElement = document.querySelector('h2');
    if (category) {
        // Capitalize first letter and handle special cases
        const categoryName = category === 'sleeping-bags' ? 'Sleeping Bags' :
            category.charAt(0).toUpperCase() + category.slice(1);
        titleElement.textContent = `Top Products: ${categoryName}`;
    } else {
        titleElement.textContent = 'Top Products';
    }
}

updateTitle(category);
// first create an instance of the ProductData class.
const dataSource = new ProductData();
// then get the element you want the product list to render in
const listElement = document.querySelector('.product-list');
// then create an instance of the ProductList class and send it the correct information.
const myList = new ProductList(category, dataSource, listElement);
// finally call the init method to show the products
myList.init();
