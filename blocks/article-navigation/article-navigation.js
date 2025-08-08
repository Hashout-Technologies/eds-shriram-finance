import { moveInstrumentation } from '../../scripts/scripts.js';
import { fetchWithCache } from '../../scripts/utils.js';

export default async function decorate(block) {
  // Fetch articles data from JSON
  const articlesData = await fetchWithCache(
    '/query-index.json', // relative so no CORS issues if hosted same origin
    'articlesQueryIndex', // cache key
    null,
    {},
    60,
    'GET',
  );

  const articles = articlesData?.data || [];

  // Get the current page path
  const currentPath = window.location.pathname.replace(/\/$/, '');

  // Find the index of the current article
  const currentIndex = articles.findIndex((article) => article.path.replace(/\/$/, '') === currentPath);

  let prevArticle = { available: false };
  let nextArticle = { available: false };

  if (currentIndex !== -1) {
    // Find previous valid article
    for (let i = currentIndex - 1; i >= 0; i -= 1) {
      if (!articles[i].path.match(/^\/articles\/[^/]+$/)) {
        prevArticle = {
          title: articles[i].title,
          url: articles[i].path,
          available: true,
        };
        break;
      }
    }
    // Find next valid article
    for (let i = currentIndex + 1; i < articles.length; i += 1) {
      if (!articles[i].path.match(/^\/articles\/[^/]+$/)) {
        nextArticle = {
          title: articles[i].title,
          url: articles[i].path,
          available: true,
        };
        break;
      }
    }
  }

  // Create Figma structure
  const frame = document.createElement('div');
  frame.className = 'frame';

  const mainDiv = document.createElement('div');
  mainDiv.className = 'div';

  // Previous article section (left)
  const prevSection = document.createElement(prevArticle.available ? 'a' : 'div');
  if (prevArticle.available) {
    prevSection.href = prevArticle.url;
  }
  prevSection.className = `div-2${prevArticle.available ? '' : ' disabled'}`;
  prevSection.style.textDecoration = 'none';
  prevSection.style.color = 'inherit';

  const prevTitle = document.createElement('p');
  prevTitle.className = 'text-wrapper';
  prevTitle.textContent = prevArticle.title;

  // Remove pagination-buttons wrapper - put hyperlink-buttons directly
  const prevHyperlinkButtons = document.createElement('div');
  prevHyperlinkButtons.className = 'hyperlink-buttons';

  const prevIconContainer = document.createElement('div');
  prevIconContainer.className = 'next-right';

  const prevLabel = document.createElement(prevArticle.available ? 'div' : '');
  if (prevArticle.available) {
    prevLabel.className = 'label';
    prevLabel.textContent = 'Previous Article';
  }

  prevHyperlinkButtons.appendChild(prevIconContainer);
  prevHyperlinkButtons.appendChild(prevLabel);

  prevSection.appendChild(prevTitle);
  prevSection.appendChild(prevHyperlinkButtons);

  // Next article section (right)
  const nextSection = document.createElement(nextArticle.available ? 'a' : 'div');
  if (nextArticle.available) {
    nextSection.href = nextArticle.url;
  }
  nextSection.className = `div-3${nextArticle.available ? '' : ' disabled'}`;
  nextSection.style.textDecoration = 'none';
  nextSection.style.color = 'inherit';

  const nextTitle = document.createElement('p');
  nextTitle.className = 'text-wrapper';
  nextTitle.textContent = nextArticle.title;

  // Remove pagination-buttons wrapper - put hyperlink-buttons directly
  const nextHyperlinkButtons = document.createElement('div');
  nextHyperlinkButtons.className = 'hyperlink-buttons';

  const nextLabel = document.createElement(nextArticle.available ? 'div' : '');
  if (nextArticle.available) {
    nextLabel.className = 'label-2';
    nextLabel.textContent = 'Next Article';
  }

  const nextIconContainer = document.createElement('div');
  nextIconContainer.className = 'vector-wrapper';

  nextHyperlinkButtons.appendChild(nextLabel);
  nextHyperlinkButtons.appendChild(nextIconContainer);

  nextSection.appendChild(nextTitle);
  nextSection.appendChild(nextHyperlinkButtons);

  // Build complete structure
  mainDiv.appendChild(prevSection);
  mainDiv.appendChild(nextSection);
  frame.appendChild(mainDiv);

  // Handle disabled states
  if (!prevArticle.available) {
    prevSection.style.pointerEvents = 'none';
    prevSection.style.cursor = 'not-allowed';
    prevLabel.style.color = '#999';
  }

  if (!nextArticle.available) {
    nextSection.style.pointerEvents = 'none';
    nextSection.style.cursor = 'not-allowed';
    nextLabel.style.color = '#999';
  }

  // Move instrumentation and replace content
  moveInstrumentation(block, frame);
  block.textContent = '';
  block.appendChild(frame);
}
