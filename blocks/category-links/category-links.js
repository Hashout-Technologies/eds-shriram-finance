import { CreateElem, fetchWithCache } from '../../scripts/utils.js';

async function getCategoryArticleCount(categoryPath) {
  try {
    // Normalize category path: ensure no trailing slash
    const normalizedCategory = categoryPath.replace(/\/$/, '');

    const data = await fetchWithCache(
      'https://article-cards--eds-shriram-finance--hashout-technologies.aem.live/query-index.json',
      'articlesQueryIndex',
      null,
      {},
      60,
      'GET',
    );

    if (!data?.data) return 0;

    return data.data.filter((item) => {
      const isInCategory = item.path.startsWith(`${normalizedCategory}/`);
      const isNotCategoryLanding = item.path !== normalizedCategory;
      return isInCategory && isNotCategoryLanding;
    }).length;
  } catch (error) {
    console.error('Error getting category count:', error);
    return 0;
  }
}

export default async function decorate(block) {
  const children = [...block.children];
  const heading = children[0];
  heading.classList.add('category-list-heading');

  const wrapper = CreateElem('div', 'category-list-wrapper', null, null);

  children.slice(1).forEach(async (item) => {
    item.classList.add('category-item');
    const divs = [...item.querySelectorAll('div')];
    if (divs[0]) divs[0].classList.add('category-item-link');
    const buttonContainer = divs[0]?.querySelector('a');
    const countDiv = CreateElem('div', 'category-item-count', null, null);
    if (buttonContainer) {
      const categoryPath = buttonContainer.getAttribute('href');
      const count = await getCategoryArticleCount(categoryPath);
      countDiv.textContent = count; // set actual article count
    }
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
