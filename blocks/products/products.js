import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = Array.from(block.children);
  let titleRow = rows[0];
  let productRows = rows;
  let titleElement;

  // Detect a standalone title row
  if (titleRow && titleRow.children.length === 1 && titleRow.textContent.trim()) {
    titleElement = document.createElement('h3');
    titleElement.textContent = titleRow.textContent.trim();
    productRows = rows.slice(1);
  }

  // Build the white container
  const container = document.createElement('div');
  container.className = 'products-container';

  // Insert title
  if (titleElement) {
    container.append(titleElement);
  } else {
    const defaultTitle = document.createElement('h3');
    defaultTitle.textContent = 'You may be interested in';
    container.append(defaultTitle);
  }

  // Build grid wrapper
  const grid = document.createElement('div');
  grid.className = 'products-grid';

  // Turn each row into a card
  productRows.forEach(row => {
    const item = createProductCard(row);
    if (item) grid.append(item);
  });

  container.append(grid);

  // Replace original block
  block.textContent = '';
  block.append(container);
}

function createProductCard(row) {
  const paras = row.querySelectorAll('p');
  if (paras.length < 2) return null;

  // picture must be first paragraph
  const picEl = paras[0].querySelector('picture');
  if (!picEl) return null;

  // second paragraph is label
  const label = paras[1].textContent.trim();
  if (!label) return null;

  // optional third paragraph link
  const linkEl = paras[2]?.querySelector('a');
  const href = linkEl ? linkEl.href : '#';

  // build anchor/card
  const a = document.createElement('a');
  a.href = href;
  a.className = 'product-item';
  a.setAttribute('aria-label', label);

  // optimized picture
  const img = picEl.querySelector('img');
  if (img) {
    const opt = createOptimizedPicture(img.src, img.alt || label, false, [{ width: '150' }]);
    moveInstrumentation(img, opt.querySelector('img'));
    a.append(opt);
  }

  // label div
  const titleDiv = document.createElement('div');
  titleDiv.className = 'product-title';
  titleDiv.textContent = label;
  a.append(titleDiv);

  // hide original link for instrumentation
  if (linkEl) {
    const hiddenLink = document.createElement('div');
    hiddenLink.className = 'product-link';
    hiddenLink.style.display = 'none';
    hiddenLink.append(linkEl.cloneNode(true));
    a.append(hiddenLink);
  }

  // preserve any AEM data attributes / analytics
  moveInstrumentation(row, a);

  return a;
}
