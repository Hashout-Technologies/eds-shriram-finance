import { moveInstrumentation } from '../../scripts/scripts.js';
import { fetchWithCache } from '../../scripts/utils.js';

function getTitleFromType(type) {
  const titles = {
    related: 'Related Articles',
    popular: 'Popular Articles',
    recent: 'Recent Articles',
  };
  return titles[type] || 'Related Articles';
}

function createArticleCard(article) {
  // Create article item wrapper
  const articleItem = document.createElement('a');
  articleItem.href = article.path;
  articleItem.className = 'article-item';

  // Create article item content
  const articleContent = document.createElement('div');
  articleContent.className = 'article-item-content';

  // Create article item inner
  const articleInner = document.createElement('div');
  articleInner.className = 'article-item-inner';

  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'article-image-container';

  // Create image
  const image = document.createElement('img');
  image.src = article.image;
  image.alt = article.title;
  image.className = 'article-image';
  image.loading = 'lazy';
  image.onerror = function handleImageError() {
    this.style.background = '#f5f5f5';
    this.alt = 'Article image';
  };

  imageContainer.appendChild(image);

  // Create title
  const title = document.createElement('div');
  title.className = 'article-title-small';
  title.textContent = article.title;

  // Build the structure
  articleInner.appendChild(imageContainer);
  articleInner.appendChild(title);
  articleContent.appendChild(articleInner);
  articleItem.appendChild(articleContent);

  return articleItem;
}

function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function loadArticles(articleType, container, loading) {
  try {
    // In real implementation, fetch from JSON files:
    // const response = await fetch(`/data/${articleType}-articles.json`);
    // const data = await response.json();

    // Fetch full articles list
    const articlesData = await fetchWithCache(
      '/query-index.json',
      'articlesQueryIndex',
      null,
      {},
      60,
      'GET',
    );

    const allArticles = articlesData?.data || [];

    // Remove trailing slash from path
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const [, , category] = currentPath.split('/'); // "/articles/{category}/..."

    let filteredArticles = [];

    if (articleType === 'related' && category) {
      filteredArticles = allArticles.filter((article) => article.path.startsWith(`/articles/${category}/`)
        && article.path !== currentPath);
    } else if (articleType === 'recent') {
      filteredArticles = [...allArticles];
    }

    // Take first 4
    const articles = filteredArticles.slice(0, 4);

    // Remove loading state
    loading.remove();

    // Create widget section full wrapper
    const widgetSection = document.createElement('div');
    widgetSection.className = 'widget-section-full';

    // Group articles into pairs (matching Figma structure)
    const articlePairs = chunkArray(articles, 2);

    // Create articles grids for each pair
    articlePairs.forEach((pair) => {
      const articlesGrid = document.createElement('div');
      articlesGrid.className = 'articles-grid';

      // Create articles-row for each article in the pair
      pair.forEach((article) => {
        const articlesRow = document.createElement('div');
        articlesRow.className = 'articles-row';

        const articleCard = createArticleCard(article);
        articlesRow.appendChild(articleCard);
        articlesGrid.appendChild(articlesRow);
      });

      widgetSection.appendChild(articlesGrid);
    });

    container.appendChild(widgetSection);
  } catch (error) {
    // Remove loading and show error
    loading.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = 'Failed to load articles. Please try again later.';
    container.appendChild(errorDiv);
  }
}

export default function decorate(block) {
  const rows = [...block.children];

  // Extract article type from first row
  let articleType = 'related'; // default
  if (rows[0] && rows[0].children[0]) {
    const typeContent = rows[0].children[0].textContent.trim();
    if (typeContent && ['related', 'popular', 'recent'].includes(typeContent)) {
      articleType = typeContent;
    }
  }

  // Create main container (matching Figma structure)
  const container = document.createElement('div');
  container.className = 'articles-listing-container';

  // Create section title
  const title = document.createElement('div');
  title.className = 'related-articles-title';
  title.textContent = getTitleFromType(articleType);
  container.appendChild(title);

  // Create loading state
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Loading articles...';
  container.appendChild(loading);

  // Move instrumentation and replace content
  moveInstrumentation(block, container);
  block.textContent = '';
  block.appendChild(container);

  // Load articles data
  loadArticles(articleType, container, loading);
}
