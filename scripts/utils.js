/**
 * Scroll the element to top of page after it is opened or expanded.
 * @param {HTMLElement} element - The element to scroll into view.
 */
export default function scrollElementToTopAfterOpen(element) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth',
      });
    }, 50);
  });
}
