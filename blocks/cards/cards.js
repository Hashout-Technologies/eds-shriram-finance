import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Check for URL in the first column (if it exists)
    const columns = [...row.children];
    let url = '';
    if (columns.length > 1) {
      const urlText = columns[0].textContent.trim();
      if (urlText) {
        url = urlText;
        // Remove the URL div as we don't want to display it
        columns[0].remove();
      }
    }

    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    // Add click event listener to the card if it has a URL
    if (url) {
      li.style.cursor = 'pointer';
      li.addEventListener('click', () => {
        window.location.href = url;
      });
    }

    ul.append(li);
  });

  // Optimize images
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
