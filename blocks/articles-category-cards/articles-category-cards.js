import { createOptimizedPicture } from '../../scripts/aem.js';
import { CreateElem, fetchWithCache } from '../../scripts/utils.js';

const getPageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('page'), 10) || 1;
};

const renderJsonCards = (data, index) => {
  const optimizedPic = data.image
    ? createOptimizedPicture(
      data.image,
      data.title,
      index === 0 ? 'eager' : 'lazy',
      [{ width: '270' }],
      true,
    )
    : '';
  return `
      <a href="${data.path}" class="article-card-content" target="_blank">
        <div class="article-item-image">${optimizedPic?.outerHTML || ''}</div>
        <div class="article-item-content">
          <p class="article-item-title">${data.title}</p>
          <p class="article-item-subtitle">${data.description || ''}</p>
          <div class="article-item-meta">
            <div class="meta-info">
              <span class="published-time"><img src="/icons/clock.svg" alt="clock">${data.lastModified}</span>
              <span class="estimated-readtime">3 Min</span>
            </div>
            <span class="read-more">Read more</span>
          </div>
        </div>
      </a>`;
};

const getPageLink = (page) => (page === 1 ? window.location.pathname : `?page=${page}`);

const renderPagination = (totalPages, currentPage) => {
  const wrapper = CreateElem('div', 'pagination-wrapper', null, null);
  const ul = document.createElement('ul');
  ul.className = 'pagination-list';

  const createPageItem = (label, page, disabled = false, active = false) => {
    const li = CreateElem('li', 'pagination-box', null, null);
    const link = document.createElement('a');
    link.href = getPageLink(page);
    link.textContent = label;
    link.className = 'pagination-link';
    if (active) {
      link.classList.add('active');
      link.addEventListener('click', (e) => e.preventDefault());
    }

    if (disabled) {
      link.classList.add('disabled');
      li.classList.add('disabled');
      link.setAttribute('tabindex', '-1');
    }
    li.appendChild(link);
    return li;
  };

  ul.appendChild(
    createPageItem('Previous', currentPage - 1, currentPage === 1),
  );

  if (currentPage > 3) {
    ul.appendChild(createPageItem('1', 1));
    if (currentPage > 4) {
      const ellipsis = document.createElement('li');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      ul.appendChild(ellipsis);
    }
  }

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i += 1) {
    ul.appendChild(createPageItem(i, i, false, i === currentPage));
  }

  if (currentPage < totalPages - 2) {
    if (currentPage < totalPages - 3) {
      const ellipsis = document.createElement('li');
      ellipsis.className = 'pagination-ellipsis';
      ellipsis.textContent = '...';
      ul.appendChild(ellipsis);
    }
    ul.appendChild(createPageItem(totalPages, totalPages));
  }

  const mobileCountLi = CreateElem(
    'li',
    'pagination-mobile-count',
    null,
    null,
  );
  mobileCountLi.innerHTML = `
  <span class="page-count">
    <span class="current">${currentPage}</span> / <span class="total">${totalPages}</span>
  </span>`;
  ul.appendChild(mobileCountLi);

  ul.appendChild(
    createPageItem('Next', currentPage + 1, currentPage === totalPages),
  );

  wrapper.appendChild(ul);
  return wrapper;
};

const renderFallback = () => {
  const fallback = CreateElem('div', 'no-results-wrapper', null, null);
  fallback.innerHTML = `
    <div class="fallback-image">
      <img src="../../images/no-record.svg" alt="No articles found"/>
    </div>
    <p class="fallback-message">Article not found</p>
  `;
  return fallback;
};

export default async function decorate(block) {
  const title = block.children[0]?.querySelector('p');
  title?.classList.add('title');
  try {
    const json = await fetchWithCache(
      'https://article-cards--eds-shriram-finance--hashout-technologies.aem.live/query-index.json',
      'articlesQueryIndex',
      null,
      {},
      60,
      'GET',
    );

    let articles = json?.data || [];

    // Determine current page path
    const currentPath = window.location.pathname.split('/').filter(Boolean);
    const isCategoryPage = currentPath.length === 2 && currentPath[0] === 'articles';
    const currentCategory = isCategoryPage ? currentPath[1] : null;

    // Remove unwanted pages
    articles = articles.filter((item) => {
      const parts = item.path.split('/').filter(Boolean);

      if (item.path === '/articles') return false;

      // Exclude category landing pages unless we're on that category page
      if (!isCategoryPage && parts.length === 2 && parts[0] === 'articles') { return false; }

      // Exclude year pages like /articles/category/2025
      if (
        parts.length === 3
        && parts[0] === 'articles'
        && /^\d{4}$/.test(parts[2])
      ) { return false; }

      return true;
    });

    // If on category page, filter for that category
    if (isCategoryPage) {
      articles = articles.filter(
        (item) => item.path.startsWith(`/articles/${currentCategory}/`)
          || item.path === `/articles/${currentCategory}`,
      );
    }

    // Sort by lastModified (newest first)
    articles.sort(
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified),
    );

    const currentPage = getPageFromUrl();
    const perPage = 9;
    const totalPages = Math.ceil(articles.length / perPage);
    if (currentPage > totalPages || currentPage < 1) {
      block.appendChild(renderFallback());
      return;
    }
    const start = (currentPage - 1) * perPage;
    const paginated = articles.slice(start, start + perPage);

    if (!paginated.length) {
      block.appendChild(renderFallback());
      return;
    }

    const articleListsWrapper = CreateElem(
      'div',
      'articles-cards-list',
      null,
      null,
    );
    paginated.forEach((item, index) => {
      const articleListingItem = CreateElem(
        'div',
        'articles-card-item',
        null,
        null,
      );
      articleListingItem.innerHTML = renderJsonCards(item, index);
      articleListsWrapper.appendChild(articleListingItem);
    });

    block.appendChild(articleListsWrapper);
    if (totalPages > 1) {
      block.appendChild(renderPagination(totalPages, currentPage));
    }
  } catch (e) {
    console.error(e);
    block.appendChild(renderFallback());
  }
}
