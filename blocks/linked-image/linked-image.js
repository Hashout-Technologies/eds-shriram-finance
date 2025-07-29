import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // alert("Linked image block initialized");
  const image = block.querySelector('img');
  const link = block.querySelector('a');

  if (!image || !link) {
    // If either image or link is missing, clean up the block
    block.textContent = '';
    return;
  }

  // Ensure the image is properly wrapped in the link
  if (!link.contains(image)) {
    // Move any instrumentation attributes from the image to the link
    moveInstrumentation(image, link);
    link.appendChild(image);
  }

  // Clear any text content from the link, keeping only the image
  link.textContent = '';
  link.appendChild(image);

  // Optimize the image if it has a src
  if (image.src) {
    const optimizedPicture = createOptimizedPicture(
      image.src,
      'Linked image', // Empty alt text
      false,
      [{ width: '800' }],
    );

    if (optimizedPicture) {
      // Move instrumentation attributes from the original image to the new optimized image
      const optimizedImg = optimizedPicture.querySelector('img');
      if (optimizedImg) {
        moveInstrumentation(image, optimizedImg);
        // Ensure optimized image also has no alt text
        optimizedImg.removeAttribute('alt');
      }
      image.replaceWith(optimizedPicture);
    }
  }

  // Add hover effect and accessibility improvements
  link.setAttribute('title', link.title || 'Linked image');

  // Ensure proper tabindex for keyboard navigation
  if (!link.hasAttribute('tabindex')) {
    link.setAttribute('tabindex', '0');
  }
}
