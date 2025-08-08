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

  const allArticles = articlesData?.data || [];

  function normalizePath(path) {
    return path.replace(/\/$/, '').toLowerCase();
  }

  // Helper function to check if the path is a landing or category page
  function isLandingOrCategory(path) {
    return (
      path === '/articles'
      || /^\/articles\/[^/]+$/.test(path)
      || /^\/articles\/[^/]+\/\d{4}$/.test(path)
    );
  }

  const currentPath = normalizePath(window.location.pathname);

  // 1️⃣ Find current index in the *full* list (before filtering)
  const currentIndexFull = allArticles.findIndex(
    (a) => normalizePath(a.path) === currentPath,
  );

  if (currentIndexFull === -1) {
    console.warn('Current page not found in articles list:', currentPath);
  }

  // 1️⃣ Filter out landing and category pages first
  const articles = allArticles.filter((article) => !isLandingOrCategory(article.path));

  // 3️⃣ Find index in filtered list
  const currentIndex = articles.findIndex(
    (a) => normalizePath(a.path) === currentPath,
  );

  let prevArticle = { available: false };
  let nextArticle = { available: false };

  if (currentIndex !== -1) {
    if (currentIndex > 0) {
      prevArticle = {
        title: articles[currentIndex - 1].title,
        url: articles[currentIndex - 1].path,
        available: true,
      };
    }
    if (currentIndex < articles.length - 1) {
      nextArticle = {
        title: articles[currentIndex + 1].title,
        url: articles[currentIndex + 1].path,
        available: true,
      };
    }
  }

  console.log('Current path:', currentPath);
  console.log('Filtered articles:', articles.map((a) => a.path));
  console.log('Current index in filtered:', currentIndex);
  console.log('Prev:', prevArticle);
  console.log('Next:', nextArticle);

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
  if (prevArticle.available) {
    prevIconContainer.className = 'next-right';
  } else {
    prevIconContainer.style.visibility = 'hidden';
  }

  const prevLabel = document.createElement('div');
  if (prevArticle.available) {
    prevLabel.className = 'label';
    prevLabel.textContent = 'Previous Article';
  } else {
    prevLabel.style.visibility = 'hidden'; // or skip appending it entirely
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

  const nextLabel = document.createElement('div');
  if (nextArticle.available) {
    nextLabel.className = 'label-2';
    nextLabel.textContent = 'Next Article';
  } else {
    nextLabel.style.visibility = 'hidden';
  }

  const nextIconContainer = document.createElement('div');
  if (nextArticle.available) {
    nextIconContainer.className = 'vector-wrapper';
  } else {
    nextIconContainer.style.visibility = 'hidden';
  }

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
