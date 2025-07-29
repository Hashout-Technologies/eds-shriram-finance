import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // For testing, show both articles - in real implementation this would be dynamic
  const prevArticle = {
    title: 'Government Policies and Gold Loan Regulations',
    url: '/articles/government-policies',
    available: true,
  };

  const nextArticle = {
    title: 'What Kind of Gold Assets Can I Get a Loan for?',
    url: '/articles/gold-assets',
    available: true,
  };

  // Create navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'nav-container';

  // Create previous article link (or placeholder)
  const prevLink = document.createElement(prevArticle.available ? 'a' : 'div');
  if (prevArticle.available) {
    prevLink.href = prevArticle.url;
  }
  prevLink.className = `nav-item prev${prevArticle.available ? '' : ' disabled'}`;

  const prevLabel = document.createElement('div');
  prevLabel.className = 'nav-label';
  prevLabel.innerHTML = '<span class="nav-arrow">‹</span>Previous Article';

  const prevTitle = document.createElement('h4');
  prevTitle.className = 'nav-title';
  prevTitle.textContent = prevArticle.title;

  prevLink.appendChild(prevLabel);
  prevLink.appendChild(prevTitle);
  navContainer.appendChild(prevLink);

  // Create next article link (or placeholder)
  const nextLink = document.createElement(nextArticle.available ? 'a' : 'div');
  if (nextArticle.available) {
    nextLink.href = nextArticle.url;
  }
  nextLink.className = `nav-item next${nextArticle.available ? '' : ' disabled'}`;

  const nextLabel = document.createElement('div');
  nextLabel.className = 'nav-label';
  nextLabel.innerHTML = 'Next Article<span class="nav-arrow">›</span>';

  const nextTitle = document.createElement('h4');
  nextTitle.className = 'nav-title';
  nextTitle.textContent = nextArticle.title;

  nextLink.appendChild(nextLabel);
  nextLink.appendChild(nextTitle);
  navContainer.appendChild(nextLink);

  // Move instrumentation and replace content
  moveInstrumentation(block, navContainer);
  block.textContent = '';
  block.appendChild(navContainer);
}
