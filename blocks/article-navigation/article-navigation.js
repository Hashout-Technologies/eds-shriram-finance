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

  const prevIcon = document.createElement('img');
  prevIcon.className = 'vector';
  prevIcon.src = '../../icons/chevron-next-article-info.svg';
  prevIcon.alt = 'Previous';
  prevIcon.style.transform = 'scaleX(1)';

  const prevLabel = document.createElement('div');
  prevLabel.className = 'label';
  prevLabel.textContent = 'Previous Article';

  prevIconContainer.appendChild(prevIcon);
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
  nextLabel.className = 'label-2';
  nextLabel.textContent = 'Next Article';

  const nextIconContainer = document.createElement('div');
  nextIconContainer.className = 'vector-wrapper';

  const nextIcon = document.createElement('img');
  nextIcon.className = 'img';
  nextIcon.src = '../../icons/chevron-next-article-info.svg';
  nextIcon.alt = 'Next';

  nextIconContainer.appendChild(nextIcon);
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
