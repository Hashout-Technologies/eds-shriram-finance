/*
 * Accordion Block
 * Recreate an accordion with global management
 * https://www.hlx.live/developer/block-collection/accordion
 *
 * Global Accordion Management:
 * - When any accordion item is opened, all other accordion items across the entire page are
 *   automatically closed
 * - This creates a consistent user experience where only one accordion item can be open at a
 *   time globally
 * - The system uses a custom event 'globalAccordionToggle' to coordinate between different
 *   accordion blocks
 * - Works with sidebar accordions, footer accordions, and any other accordion blocks on the page
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

// Global accordion management
const GLOBAL_ACCORDION_EVENT = 'globalAccordionToggle';

/**
 * Closes all accordion items globally except the specified one
 * @param {Element} exceptItem - The accordion item to keep open
 */
function closeOtherAccordionItems(exceptItem) {
  const allAccordionItems = document.querySelectorAll('details[open]');
  allAccordionItems.forEach((item) => {
    if (item !== exceptItem) {
      item.removeAttribute('open');
    }
  });
}

/**
 * Sets up global accordion event listener
 * This ensures the listener is only set up once across all accordion blocks
 */
function setupGlobalAccordionListener() {
  if (window.globalAccordionListenerSet) return;

  document.addEventListener(GLOBAL_ACCORDION_EVENT, (event) => {
    const { openedItem } = event.detail;
    closeOtherAccordionItems(openedItem);
  });

  window.globalAccordionListenerSet = true;
}

export default function decorate(block) {
  const accordionItems = [];

  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    // decorate accordion item body
    const body = row.children[1];
    body.className = 'accordion-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-item';
    details.append(summary, body);

    // Collect for event binding
    accordionItems.push(details);

    row.replaceWith(details);
  });

  // Setup global accordion listener
  setupGlobalAccordionListener();

  // Add toggle behavior: global accordion management
  accordionItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Dispatch global event to close other accordion items
        const event = new CustomEvent(GLOBAL_ACCORDION_EVENT, {
          detail: { openedItem: item },
        });
        document.dispatchEvent(event);
      }
    });
  });
}
