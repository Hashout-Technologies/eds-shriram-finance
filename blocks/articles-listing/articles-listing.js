import { moveInstrumentation } from '../../scripts/scripts.js';

// Dummy data - replace with actual JSON file fetching later
const articlesData = {
  related: [
    {
      id: '1',
      title: 'Government Policies and Gold Loan Regulations',
      image: '/images/article-1.jpg',
      url: '/articles/government-policies',
    },
    {
      id: '2',
      title: 'Understanding Gold Loan Interest Rates',
      image: '/images/article-2.jpg',
      url: '/articles/interest-rates',
    },
    {
      id: '3',
      title: 'Types of Gold Assets for Loans',
      image: '/images/article-3.jpg',
      url: '/articles/gold-assets',
    },
    {
      id: '4',
      title: 'Gold Loan Application Process',
      image: '/images/article-4.jpg',
      url: '/articles/application-process',
    },
  ],
  popular: [
    {
      id: '5',
      title: 'Most Popular Gold Loan Guide',
      image: '/images/popular-1.jpg',
      url: '/articles/popular-guide',
    },
    {
      id: '6',
      title: 'Top Gold Investment Tips',
      image: '/images/popular-2.jpg',
      url: '/articles/investment-tips',
    },
    {
      id: '7',
      title: 'Best Gold Loan Rates 2024',
      image: '/images/popular-3.jpg',
      url: '/articles/best-rates',
    },
    {
      id: '8',
      title: 'Gold Loan vs Personal Loan',
      image: '/images/popular-4.jpg',
      url: '/articles/loan-comparison',
    },
  ],
  recent: [
    {
      id: '9',
      title: 'Latest Gold Market Trends',
      image: '/images/recent-1.jpg',
      url: '/articles/market-trends',
    },
    {
      id: '10',
      title: 'New RBI Guidelines for Gold Loans',
      image: '/images/recent-2.jpg',
      url: '/articles/rbi-guidelines',
    },
    {
      id: '11',
      title: 'Digital Gold Loans: The Future',
      image: '/images/recent-3.jpg',
      url: '/articles/digital-loans',
    },
    {
      id: '12',
      title: 'Gold Price Predictions 2024',
      image: '/images/recent-4.jpg',
      url: '/articles/price-predictions',
    },
  ],
};

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
  articleItem.href = article.url;
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

    // For now, use dummy data
    const articles = articlesData[articleType] || articlesData.related;

    // Remove loading state
    loading.remove();

    // Create widget section full wrapper
    const widgetSection = document.createElement('div');
    widgetSection.className = 'widget-section-full';

    // Group articles into pairs (matching Figma structure)
    const articlePairs = chunkArray(articles.slice(0, 4), 2);

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
