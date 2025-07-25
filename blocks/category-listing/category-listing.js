export default function decorate(block) {
  [...block.children].forEach((item) => {
    const divs = item.querySelectorAll('div');
    const link = divs[0]?.querySelector('a')?.href;
    const label = divs[1]?.querySelector('p')?.textContent;

    // Hide the raw link block
    divs[0].style.display = 'none';

    // if (link && label) {
    //   const anchor = document.createElement('a');
    //   anchor.href = link;
    //   anchor.className = 'category-pill';
    //   anchor.setAttribute('aria-label', label);
    //   anchor.innerHTML = `
    //     <span class="pill-text">${label}</span>
    //     <span class="pill-arrow">›</span>
    //   `;

    //   divs[1].innerHTML = '';
    //   divs[1].appendChild(anchor);
    // }

    if (label) {
      const anchor = document.createElement(link ? 'a' : 'span');
      if (link) {
        anchor.href = link;
        anchor.className = 'category-pill';
        anchor.setAttribute('aria-label', label);
      } else {
        anchor.className = 'category-pill disabled';
      }

      anchor.innerHTML = `
    <span class="pill-text">${label}</span>
    <span class="pill-arrow">›</span>
  `;

      divs[1].innerHTML = '';
      divs[1].appendChild(anchor);
    }
  });
}
