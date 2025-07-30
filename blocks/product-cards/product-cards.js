import { CreateElem } from '../../scripts/utils.js';

export default function decorate(block) {
  const children = [...block.children];
  const heading = children[0];
  heading.classList.add('product-cards-heading');

  const wrapper = CreateElem('div', 'product-cards-wrapper', null, null);

  children.slice(1).forEach((item) => {
    item.classList.add('product-card-item');
    const divs = [...item.querySelectorAll('div')];

    if (divs[0]) divs[0].classList.add('product-card-title');
    if (divs[1]) divs[1].classList.add('product-card-description');
    if (divs[2]) divs[2].classList.add('product-card-interest-rate');
    if (divs[3]) divs[3].classList.add('product-card-cta-link');

    const buttonContainer = divs[3]?.querySelector('a');
    const lastDiv = divs[4];
    if (buttonContainer && lastDiv) {
      buttonContainer.removeAttribute('title');
      const text = lastDiv.querySelector('p')?.textContent.trim();
      if (text) {
        buttonContainer.textContent = text;
      }
      lastDiv.remove();
    }

    if (divs[2] && divs[3]) {
      const bottomContent = CreateElem('div', 'bottom-content', null, null);
      bottomContent.appendChild(divs[2]);
      bottomContent.appendChild(divs[3]);
      item.appendChild(bottomContent);
    }
    wrapper.appendChild(item);
  });

  block.innerHTML = '';
  block.appendChild(heading);
  block.appendChild(wrapper);
}
