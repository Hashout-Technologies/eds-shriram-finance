import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function getTextClassName(label) {
  // Map specific labels to their respective CSS classes from Figma
  const labelClassMap = {
    'Two Wheeler Loan': 'twl-text',
    'Gold Loan': 'gl-text',
    'Business Loan': 'bl-text',
    'Used Car Loan': 'ucl-text',
  };

  return labelClassMap[label] || 'interest-text';
}

function createProductCard(row, index, isMiddleInRow = false) {
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

  // build anchor/card with proper Figma class structure
  const a = document.createElement('a');
  a.href = href;
  a.className = isMiddleInRow ? 'interest-item-center' : 'interest-item';
  a.setAttribute('aria-label', label);

  // create icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = 'interest-icon';

  // optimized picture
  const img = picEl.querySelector('img');
  if (img) {
    const opt = createOptimizedPicture(img.src, img.alt || label, false, [{ width: '150' }]);
    const optimizedImg = opt.querySelector('img');
    optimizedImg.className = 'icon-image';
    moveInstrumentation(img, optimizedImg);
    iconContainer.append(opt);
  }

  a.append(iconContainer);

  // label div with appropriate class
  const titleDiv = document.createElement('div');
  titleDiv.className = getTextClassName(label);
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

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export default function decorate(block) {
  const rows = Array.from(block.children);
  const titleRow = rows[0];
  let productRows = rows;
  let titleElement;

  // Detect a standalone title row
  if (titleRow && titleRow.children.length === 1 && titleRow.textContent.trim()) {
    titleElement = document.createElement('div');
    titleElement.className = 'widget-title';
    titleElement.textContent = titleRow.textContent.trim();
    productRows = rows.slice(1);
  }

  // Build the container with Figma structure
  const container = document.createElement('div');
  container.className = 'products-container';

  // Create widget-content wrapper
  const widgetContent = document.createElement('div');
  widgetContent.className = 'widget-content';

  // Create widget-section
  const widgetSection = document.createElement('div');
  widgetSection.className = 'widget-section';

  // Create widget-sections
  const widgetSections = document.createElement('div');
  widgetSections.className = 'widget-sections';

  // Insert title
  if (titleElement) {
    widgetSections.append(titleElement);
  } else {
    const defaultTitle = document.createElement('div');
    defaultTitle.className = 'widget-title';
    defaultTitle.textContent = 'You may be interested in';
    widgetSections.append(defaultTitle);
  }

  // Convert rows to product cards
  const productCards = [];
  productRows.forEach((row, index) => {
    const item = createProductCard(row, index);
    if (item) productCards.push(item);
  });

  // Group products into rows of 3 (matching Figma layout)
  const productChunks = chunkArray(productCards, 3);

  // Create interest-grid for each chunk
  productChunks.forEach((chunk) => {
    const grid = document.createElement('div');
    grid.className = 'interest-grid';

    chunk.forEach((card, indexInChunk) => {
      // Apply special class for middle item in row
      if (indexInChunk === 1 && chunk.length === 3) {
        card.className = 'interest-item-center';
      }
      grid.append(card);
    });

    widgetSections.append(grid);
  });

  // Build the nested structure
  widgetSection.append(widgetSections);
  widgetContent.append(widgetSection);
  container.append(widgetContent);

  // Replace original block
  block.textContent = '';
  block.append(container);
}
