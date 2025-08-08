import { createOptimizedPicture } from '../../scripts/aem.js';
import { CreateElem, FetchData } from '../../scripts/utils.js';

const API_URL = 'https://article-cards--eds-shriram-finance--hashout-technologies.aem.live/query-index.json';

const getPageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('page'), 10) || 1;
};

function parseCustomDate(dateStr) {
  if (!dateStr) return 0; // if empty, push to end of list
  // Remove ordinal suffixes like "st", "nd", "rd", "th"
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
  const parsed = Date.parse(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

const renderJsonCards = (data, index) => {
  const optimizedPic = data.articleImage
    ? createOptimizedPicture(data.articleImage, data.title, index === 0 ? 'eager' : 'lazy', [{ width: '270' }], true)
    : '';
  return `
      <a href="${data.cardLink}" class="article-card-content">
        <div class="article-item-image">${optimizedPic?.outerHTML || ''}</div>
        <div class="article-item-content">
          <p class="article-item-title">${data.title}</p>
          <p class="article-item-subtitle">${data.description}</p>
          <div class="article-item-meta">
            <div class="meta-info">
              <span class="published-time"><img src="/icons/clock.svg" alt="clock">${data.publishedDuration}</span>
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

  ul.appendChild(createPageItem('Previous', currentPage - 1, currentPage === 1));

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

  const mobileCountLi = CreateElem('li', 'pagination-mobile-count', null, null);
  mobileCountLi.innerHTML = `
  <span class="page-count">
    <span class="current">${currentPage}</span> / <span class="total">${totalPages}</span>
  </span>`;
  ul.appendChild(mobileCountLi);

  ul.appendChild(createPageItem('Next', currentPage + 1, currentPage === totalPages));

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
    const json = await FetchData(API_URL, null, {}, null, 'GET');
    const articlesRaw = json?.data || [];

    // Filter out:
    // 1. The /articles root listing page
    // 2. Category landing pages: /articles/{category}
    // 3. Year landing pages: /articles/{category}/{year}
    const articles = articlesRaw.filter((item) => {
      const parts = item.path.split('/').filter(Boolean);

      // Exclude /articles
      if (item.path === '/articles') return false;

      // Exclude /articles/{category} (2 parts)
      if (parts.length === 2) return false;

      // Exclude /articles/{category}/{year} (year is 4 digits)
      if (parts.length === 3 && /^\d{4}$/.test(parts[2])) return false;

      return true;
    });

    // Sort by parsed lastModified date
    articles.sort((a, b) => parseCustomDate(b.lastModified) - parseCustomDate(a.lastModified));

    const currentPage = getPageFromUrl();
    const perPage = 9;
    const totalPages = Math.ceil(articles.length / perPage);

    if (currentPage > totalPages || currentPage < 1) {
      block.appendChild(renderFallback());
      return;
    }

    const start = (currentPage - 1) * perPage;
    const paginated = articles.slice(start, start + perPage);

    const articleListsWrapper = CreateElem('div', 'articles-cards-list', null, null);
    paginated.forEach((item, index) => {
      const articleListingItem = CreateElem('div', 'articles-card-item', null, null);
      articleListingItem.innerHTML = renderJsonCards({
        articleImage: item.image || '',
        title: item.title,
        description: item.description,
        publishedDuration: item.lastModified || '',
        estimatedReadTime: '3 Min',
        cardLink: item.path, // relative link
      }, index);
      articleListsWrapper.appendChild(articleListingItem);
    });

    block.appendChild(articleListsWrapper);
    if (totalPages > 1) {
      block.appendChild(renderPagination(totalPages, currentPage));
    }
  } catch (e) {
    console.error('Error loading articles:', e);
    block.appendChild(renderFallback());
  }
}
