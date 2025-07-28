export default function decorate(block) {
  [...block.children].forEach((item) => {
    const divs = item.querySelectorAll('div');
    const link = divs[0]?.querySelector('a')?.href;
    const label = divs[1]?.querySelector('p')?.textContent;

    // Hide the raw link block
    divs[0].remove();

    if (label) {
      const anchor = document.createElement(link ? 'a' : 'span');
      if (link) {
        anchor.href = link;
        anchor.className = 'category-item-link';
        anchor.setAttribute('aria-label', label);
      } else {
        anchor.className = 'category-item-link disabled';
      }

      anchor.innerHTML = `
    <span class="pill-text">${label}</span>
  `;
      divs[1].innerHTML = '';
      divs[1].appendChild(anchor);
    }
  });
}
