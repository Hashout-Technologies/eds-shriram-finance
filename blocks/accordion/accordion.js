/*
 * Accordion Block with Global Management
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

const GLOBAL_ACCORDION_EVENT = 'globalAccordionToggle';

/**
 * Closes all accordion items except the specified one
 * @param {Element} exceptItem - The accordion item to keep open
 */
function closeOtherAccordionItems(exceptItem) {
  document.querySelectorAll('details[open]').forEach((item) => {
    if (item !== exceptItem) {
      item.removeAttribute('open');
    }
  });
}

/**
 * Sets up global accordion event listener (runs once per page)
 */
function setupGlobalAccordionListener() {
  if (window.globalAccordionListenerSet) return;

  document.addEventListener(GLOBAL_ACCORDION_EVENT, (event) => {
    closeOtherAccordionItems(event.detail.openedItem);
  });

  window.globalAccordionListenerSet = true;
}

export default function decorate(block) {
  const accordionItems = [];

  // Convert block children to accordion items
  [...block.children].forEach((row) => {
    const [label, body] = row.children;

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    body.className = 'accordion-item-body';

    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-item';
    details.append(summary, body);

    accordionItems.push(details);
    row.replaceWith(details);
  });

  // Setup global coordination
  setupGlobalAccordionListener();

  // Add global toggle behavior
  accordionItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        document.dispatchEvent(new CustomEvent(GLOBAL_ACCORDION_EVENT, {
          detail: { openedItem: item },
        }));
      }
    });
  });
}
