import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Check if there's a link in this card
    const linkElement = row.querySelector('a');
    let linkWrapper = null;

    if (linkElement && linkElement.href) {
      // Create a wrapper link for the entire card
      linkWrapper = document.createElement('a');
      linkWrapper.href = linkElement.href;
      linkWrapper.className = 'cards-card-link';

      // Remove the original link element from the content
      linkElement.remove();
    }

    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    // If we have a link, wrap the li in the link wrapper
    if (linkWrapper) {
      linkWrapper.append(li);
      ul.append(linkWrapper);
    } else {
      ul.append(li);
    }
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
