import { moveInstrumentation } from '../../scripts/scripts.js';

// Dummy data - replace with actual JSON file fetching later
const articlesData = {
  related: [
    {
      id: '1',
      title: 'Government Policies and Gold Loan Regulations',
      image: '/images/article-1.jpg',
      url: '/articles/government-policies'
    },
    {
      id: '2',
      title: 'Understanding Gold Loan Interest Rates',
      image: '/images/article-2.jpg',
      url: '/articles/interest-rates'
    },
    {
      id: '3',
      title: 'Types of Gold Assets for Loans',
      image: '/images/article-3.jpg',
      url: '/articles/gold-assets'
    },
    {
      id: '4',
      title: 'Gold Loan Application Process',
      image: '/images/article-4.jpg',
      url: '/articles/application-process'
    }
  ],
  popular: [
    {
      id: '5',
      title: 'Most Popular Gold Loan Guide',
      image: '/images/popular-1.jpg',
      url: '/articles/popular-guide'
    },
    {
      id: '6',
      title: 'Top Gold Investment Tips',
      image: '/images/popular-2.jpg',
      url: '/articles/investment-tips'
    },
    {
      id: '7',
      title: 'Best Gold Loan Rates 2024',
      image: '/images/popular-3.jpg',
      url: '/articles/best-rates'
    },
    {
      id: '8',
      title: 'Gold Loan vs Personal Loan',
      image: '/images/popular-4.jpg',
      url: '/articles/loan-comparison'
    }
  ],
  recent: [
    {
      id: '9',
      title: 'Latest Gold Market Trends',
      image: '/images/recent-1.jpg',
      url: '/articles/market-trends'
    },
    {
      id: '10',
      title: 'New RBI Guidelines for Gold Loans',
      image: '/images/recent-2.jpg',
      url: '/articles/rbi-guidelines'
    },
    {
      id: '11',
      title: 'Digital Gold Loans: The Future',
      image: '/images/recent-3.jpg',
      url: '/articles/digital-loans'
    },
    {
      id: '12',
      title: 'Gold Price Predictions 2024',
      image: '/images/recent-4.jpg',
      url: '/articles/price-predictions'
    }
  ]
};

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
  
  // Create container
  const container = document.createElement('div');
  container.className = 'articles-listing-container';
  
  // Create section title
  const title = document.createElement('h2');
  title.className = 'section-title';
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

function getTitleFromType(type) {
  const titles = {
    related: 'Related Articles',
    popular: 'Popular Articles', 
    recent: 'Recent Articles'
  };
  return titles[type] || 'Related Articles';
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
    
    // Create articles grid
    const grid = document.createElement('div');
    grid.className = 'articles-grid';
    
    // Create article cards (limit to 4)
    articles.slice(0, 4).forEach(article => {
      const card = createArticleCard(article);
      grid.appendChild(card);
    });
    
    container.appendChild(grid);
    
  } catch (error) {
    console.error('Failed to load articles:', error);
    
    // Remove loading and show error
    loading.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = 'Failed to load articles. Please try again later.';
    container.appendChild(errorDiv);
  }
}

function createArticleCard(article) {
  const card = document.createElement('a');
  card.href = article.url;
  card.className = 'article-card';

  // Image
  const image = document.createElement('img');
  image.src = article.image;
  image.alt = article.title;
  image.className = 'article-image';
  image.loading = 'lazy';
  image.onerror = function() {
    this.style.background = '#f0e68c';
    this.alt = 'Article image';
  };
  card.appendChild(image);

  // Title
  const title = document.createElement('h3');
  title.className = 'article-title';
  title.textContent = article.title;
  card.appendChild(title);

  return card;
}
