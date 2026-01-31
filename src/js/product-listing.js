import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getParam, updateCartCount } from './utils.mjs';

loadHeaderFooter().then(() => {
  setTimeout(() => {
    updateCartCount();
  }, 100);
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      myList.renderSorted(e.target.value);
    });
  }
});

const category = getParam('category');

function updateTitle(categoryName) {
  const titleElement = document.querySelector('h2');
  if (categoryName) {
    const formattedName =
      categoryName === 'sleeping-bags'
        ? 'Sleeping Bags'
        : categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    titleElement.textContent = `Top Products: ${formattedName}`;
  } else {
    titleElement.textContent = 'Top Products';
  }
}

updateTitle(category);
const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');

let currentProducts = [];
const myList = new ProductList(category, dataSource, listElement);

async function updateBreadcrumbs() {
  const breadcrumbElem = document.getElementById('breadcrumbs');
  if (!breadcrumbElem) return;
  if (!category) {
    breadcrumbElem.innerHTML = '';
    return;
  }

  const products = await dataSource.getData(category);
  const formattedName =
    category === 'sleeping-bags'
      ? 'Sleeping Bags'
      : category.charAt(0).toUpperCase() + category.slice(1);
  breadcrumbElem.innerHTML = `
    <a href="../index.html">Home</a>
    <span class="crumb-sep">&rarr;</span>
    <span>${formattedName}</span>
    <span class="crumb-sep">&rarr;</span>
    <span>(${products.length} items)</span>
  `;
}

function sortProducts(products, sortType) {
  const sorted = [...products];
  switch (sortType) {
    case 'name-asc':
      sorted.sort((a, b) =>
        (a.NameWithoutBrand || a.Name || '').localeCompare(
          b.NameWithoutBrand || b.Name || '',
        ),
      );
      break;
    case 'name-desc':
      sorted.sort((a, b) =>
        (b.NameWithoutBrand || b.Name || '').localeCompare(
          a.NameWithoutBrand || a.Name || '',
        ),
      );
      break;
    case 'price-asc':
      sorted.sort(
        (a, b) =>
          (a.FinalPrice || a.ListPrice || 0) -
          (b.FinalPrice || b.ListPrice || 0),
      );
      break;
    case 'price-desc':
      sorted.sort(
        (a, b) =>
          (b.FinalPrice || b.ListPrice || 0) -
          (a.FinalPrice || a.ListPrice || 0),
      );
      break;
    default:
      break;
  }
  return sorted;
}

myList.renderSorted = function (sortType) {
  const sorted = sortProducts(currentProducts, sortType);
  this.renderList(sorted);
};

const origInit = myList.init.bind(myList);
myList.init = async function () {
  await origInit();
  const list = await dataSource.getData(category);
  currentProducts = list;
};

myList.init().then(updateBreadcrumbs);
