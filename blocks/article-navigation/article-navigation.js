import { moveInstrumentation } from '../../scripts/scripts.js';

// Dummy articles data - replace with actual API call later
const articlesData = {
  "articles": [
    {
      "id": "1",
      "title": "Understanding Gold Loan Basics",
      "url": "/articles/gold-loan-basics"
    },
    {
      "id": "2", 
      "title": "Government Policies and Gold Loan Regulations",
      "url": "/articles/government-policies-gold-loan-regulations"
    },
    {
      "id": "3",
      "title": "What Kind of Gold Assets Can I Get a Loan for?",
      "url": "/articles/gold-assets-loan-types"
    },
    {
      "id": "4",
      "title": "Gold Loan Interest Rates and Terms",
      "url": "/articles/gold-loan-interest-rates"
    }
  ]
};

export default function decorate(block) {
  // Get current article from URL
  const currentUrl = window.location.pathname;
  const articles = articlesData.articles;
  
  // Find current article index
  const currentIndex = articles.findIndex(article => 
    currentUrl.includes(article.url) || currentUrl.includes(article.id)
  );
  
  // If current article not found, hide the navigation
  if (currentIndex === -1) {
    block.style.display = 'none';
    return;
  }
  
  const currentArticle = articles[currentIndex];
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  
  // Create navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'nav-container';
  
  // Add appropriate class for styling
  if (prevArticle && nextArticle) {
    navContainer.className += ' both-items';
  } else if (prevArticle && !nextArticle) {
    navContainer.className += ' single-item prev-only';
  } else if (!prevArticle && nextArticle) {
    navContainer.className += ' single-item';
  }
  
  // Create previous article link
  if (prevArticle) {
    const prevLink = createNavLink(prevArticle, 'prev', 'Previous Article');
    navContainer.appendChild(prevLink);
  }
  
  // Create next article link  
  if (nextArticle) {
    const nextLink = createNavLink(nextArticle, 'next', 'Next Article');
    navContainer.appendChild(nextLink);
  }
  
  // Move instrumentation and replace content
  moveInstrumentation(block, navContainer);
  block.textContent = '';
  block.appendChild(navContainer);
}

function createNavLink(article, type, label) {
  const link = document.createElement('a');
  link.href = article.url;
  link.className = `nav-item ${type}`;
  
  // Create arrow
  const arrow = document.createElement('span');
  arrow.className = 'nav-arrow';
  arrow.textContent = type === 'prev' ? '‹' : '›';
  
  // Create content container
  const content = document.createElement('div');
  content.className = 'nav-content';
  
  // Create label
  const labelElement = document.createElement('div');
  labelElement.className = 'nav-label';
  labelElement.textContent = label;
  
  // Create title
  const title = document.createElement('h4');
  title.className = 'nav-title';
  title.textContent = article.title;
  
  content.appendChild(labelElement);
  content.appendChild(title);
  
  // Append in correct order based on type
  if (type === 'prev') {
    link.appendChild(arrow);
    link.appendChild(content);
  } else {
    link.appendChild(content);
    link.appendChild(arrow);
  }
  
  return link;
}