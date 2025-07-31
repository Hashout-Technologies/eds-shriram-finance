import { CreateElem } from '../../scripts/utils.js';

export default function decorate(block) {
  const children = [...block.children];
  const heading = children[0];
  heading.classList.add('category-list-heading');

  const wrapper = CreateElem('div', 'category-list-wrapper', null, null);

  children.slice(1).forEach((item, index) => {
    item.classList.add('category-item');
    const divs = [...item.querySelectorAll('div')];
    if (divs[0]) divs[0].classList.add('category-item-link');
    const buttonContainer = divs[0]?.querySelector('a');
    const countDiv = CreateElem('div', 'category-item-count', null, null);
    countDiv.textContent = index + 1;
    const lastDiv = divs[1];
    if (buttonContainer && lastDiv) {
      buttonContainer.removeAttribute('title');
      const text = lastDiv.querySelector('p')?.textContent.trim();
      if (text) {
        buttonContainer.textContent = text;
      }
      lastDiv.remove();
      divs[0].appendChild(countDiv);
    }
    wrapper.appendChild(item);
  });

  block.innerHTML = '';
  block.appendChild(heading);
  block.appendChild(wrapper);
}
