import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Extract data from AEM structure
  const title = rows[0]?.querySelector('p')?.textContent || 'Government Policies and Gold Loan Regulations';
  const author = rows[1]?.querySelector('p')?.textContent || 'Shriram Finance';
  const postedDate = rows[2]?.querySelector('p')?.textContent || '16th July, 2025';
  const updatedDate = rows[3]?.querySelector('p')?.textContent || '16th July, 2025';

  // Extract icon images
  const shareIcon = rows[4]?.querySelector('img');
  const viewIcon = rows[5]?.querySelector('img');
  const timeIcon = rows[6]?.querySelector('img');

  // Create the exact Figma HTML structure
  const articleHeader = document.createElement('div');
  articleHeader.className = 'article-header';

  const headerContent = document.createElement('div');
  headerContent.className = 'header-content';

  const titleSection = document.createElement('div');
  titleSection.className = 'title-section';

  const articleTitle = document.createElement('div');
  articleTitle.className = 'article-title';
  articleTitle.textContent = title;

  const metaInfo = document.createElement('div');
  metaInfo.className = 'meta-info';

  // Date and Share Section
  const dateShareSection = document.createElement('div');
  dateShareSection.className = 'date-share-section';

  const datesContainer = document.createElement('div');
  datesContainer.className = 'dates-container';

  const postedDateDiv = document.createElement('div');
  postedDateDiv.className = 'posted-date';
  postedDateDiv.innerHTML = `Posted: <span class="date-bold">${postedDate}</span>`;

  const updatedDateContainer = document.createElement('div');
  updatedDateContainer.className = 'updated-date-container';

  const updatedDateDiv = document.createElement('div');
  updatedDateDiv.className = 'updated-date';
  updatedDateDiv.innerHTML = `Updated: <span class="date-bold">${updatedDate}</span>`;

  const updatedDateDuplicate = document.createElement('div');
  updatedDateDuplicate.className = 'updated-date-duplicate';
  updatedDateDuplicate.innerHTML = `Updated: <span class="date-bold">${updatedDate}</span>`;

  updatedDateContainer.appendChild(updatedDateDiv);
  updatedDateContainer.appendChild(updatedDateDuplicate);

  datesContainer.appendChild(postedDateDiv);
  datesContainer.appendChild(updatedDateContainer);

  // Share Section - Updated with Figma structure
  const shareSection = document.createElement('div');
  shareSection.className = 'frame';

  // Share Group (Text + Icon)
  const shareGroup = document.createElement('div');
  shareGroup.className = 'group';
  shareGroup.style.cursor = 'pointer';

  const shareText = document.createElement('div');
  shareText.className = 'text-wrapper';
  shareText.textContent = 'Share';

  const shareImg = document.createElement('img');
  shareImg.className = 'img';
  shareImg.alt = 'Share';
  if (shareIcon) {
    shareImg.src = shareIcon.src;
  }

  shareGroup.appendChild(shareText);
  shareGroup.appendChild(shareImg);

  // Views Group (Count + Icon)
  const viewsGroupWrapper = document.createElement('div');
  viewsGroupWrapper.className = 'group-wrapper';

  const viewsGroup = document.createElement('div');
  viewsGroup.className = 'div';

  const shareCount = document.createElement('div');
  shareCount.className = 'text-wrapper-2';
  shareCount.textContent = '2202';

  const viewImg = document.createElement('img');
  viewImg.className = 'img';
  viewImg.alt = 'Views';
  if (viewIcon) {
    viewImg.src = viewIcon.src;
  }

  viewsGroup.appendChild(shareCount);
  viewsGroup.appendChild(viewImg);
  viewsGroupWrapper.appendChild(viewsGroup);

  // Time Group (Icon + Text)
  const timeGroupWrapper = document.createElement('div');
  timeGroupWrapper.className = 'frame-wrapper';

  const timeGroup = document.createElement('div');
  timeGroup.className = 'div-2';

  const timeImg = document.createElement('img');
  timeImg.className = 'clock-timer';
  timeImg.alt = 'Time';
  if (timeIcon) {
    timeImg.src = timeIcon.src;
  }

  const readTimeText = document.createElement('div');
  readTimeText.className = 'text-wrapper-3';
  readTimeText.textContent = '3 Min';

  timeGroup.appendChild(timeImg);
  timeGroup.appendChild(readTimeText);
  timeGroupWrapper.appendChild(timeGroup);

  // Append all groups to share section
  shareSection.appendChild(shareGroup);
  shareSection.appendChild(viewsGroupWrapper);
  shareSection.appendChild(timeGroupWrapper);

  dateShareSection.appendChild(datesContainer);
  dateShareSection.appendChild(shareSection);

  // Category and Author Section
  const categoryAuthorSection = document.createElement('div');
  categoryAuthorSection.className = 'category-author-section';

  const categoryAuthorWrapper = document.createElement('div');
  categoryAuthorWrapper.className = 'category-author-wrapper';

  const categoryAuthorContent = document.createElement('div');
  categoryAuthorContent.className = 'category-author-content';

  const categorySection = document.createElement('div');
  categorySection.className = 'category-section';
  categorySection.innerHTML = 'Category: <span class="category-bold">Gold Loan</span>';

  const authorSection = document.createElement('div');
  authorSection.className = 'author-section';

  const authorContent = document.createElement('div');
  authorContent.className = 'author-content';

  const authorText = document.createElement('div');
  authorText.className = 'author-text';
  authorText.innerHTML = `Written by: <span class="author-bold">${author}</span>`;

  const termsText = document.createElement('div');
  termsText.className = 'terms-text';
  termsText.textContent = '*T&C Apply';

  authorContent.appendChild(authorText);
  authorContent.appendChild(termsText);
  authorSection.appendChild(authorContent);

  categoryAuthorContent.appendChild(categorySection);
  categoryAuthorContent.appendChild(authorSection);
  categoryAuthorWrapper.appendChild(categoryAuthorContent);
  categoryAuthorSection.appendChild(categoryAuthorWrapper);

  // Build the complete structure
  metaInfo.appendChild(dateShareSection);
  metaInfo.appendChild(categoryAuthorSection);

  titleSection.appendChild(articleTitle);
  titleSection.appendChild(metaInfo);

  headerContent.appendChild(titleSection);
  articleHeader.appendChild(headerContent);

  // Helper function to show user feedback
  function showCopyFeedback() {
    const notification = document.createElement('div');
    notification.textContent = 'Link copied to clipboard!';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      z-index: 1000;
      font-family: Arial, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Add click functionality to share
  shareGroup.onclick = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          showCopyFeedback();
        })
        .catch(() => {
          showCopyFeedback();
        });
    }
  };

  // Clear the block and add new content
  block.textContent = '';
  block.appendChild(articleHeader);

  // Move instrumentation for tracking
  moveInstrumentation(block, articleHeader);
}