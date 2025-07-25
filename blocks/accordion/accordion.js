/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { moveInstrumentation } from '../../scripts/scripts.js';
import scrollElementToTopAfterOpen from '../../scripts/utils.js';

export default function decorate(block) {
  const detailsList = [];

  [...block.children].forEach((row, index) => {
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

    if (index === 0) {
      details.setAttribute('open', '');
    }

    detailsList.push(details);
    row.replaceWith(details);
  });

  detailsList.forEach((detail) => {
    const summary = detail.querySelector('summary');

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      const isOpen = detail.hasAttribute('open');

      // If already open, close it
      if (isOpen) {
        detail.removeAttribute('open');
        return;
      }

      // Close others
      detailsList.forEach((d) => {
        if (d !== detail) d.removeAttribute('open');
      });

      setTimeout(() => {
        detail.setAttribute('open', '');

        // Scroll after it's open
        scrollElementToTopAfterOpen(detail);
      }, 200); // Wait for others to collapse
    });
  });
}
