import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Inject CSS directly
  const css = `
/* Article Header Block Styling - Updated with Figma Design and Specific Selectors */

/* Article Header CSS - All selectors scoped to article-header block */

.article-header-wrapper .article-header {
  align-self: stretch; 
  flex-direction: column; 
  justify-content: flex-start; 
  align-items: flex-start; 
  gap: 16px; 
  display: flex;
}

.article-header-wrapper .article-header .header-content {
  align-self: stretch; 
  flex-direction: column; 
  justify-content: flex-start; 
  align-items: flex-start; 
  gap: 24px; 
  display: flex;
}

.article-header-wrapper .article-header .title-section {
  align-self: stretch; 
  flex-direction: column; 
  justify-content: flex-start; 
  align-items: flex-start; 
  gap: 16px; 
  display: flex;
}

.article-header-wrapper .article-header .article-title {
  align-self: stretch; 
  color: #333; 
  font-size: 24px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 700; 
  line-height: 28.80px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .meta-info {
  align-self: stretch; 
  flex-direction: column; 
  justify-content: flex-start; 
  align-items: flex-start; 
  gap: 16px; 
  display: flex;
}

.article-header-wrapper .article-header .date-share-section {
  align-self: stretch; 
  justify-content: space-between; 
  align-items: center; 
  display: inline-flex;
}

.article-header-wrapper .article-header .dates-container {
  width: 343px; 
  justify-content: space-between; 
  align-items: center; 
  display: flex;
}

.article-header-wrapper .article-header .posted-date {
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 400; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .date-bold {
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 600; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .updated-date-container {
  width: 166px; 
  height: 21px; 
  position: relative;
}

.article-header-wrapper .article-header .updated-date {
  left: 0; 
  top: 0; 
  position: absolute; 
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 400; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .updated-date-duplicate {
  left: 0; 
  top: 0; 
  position: absolute; 
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 400; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .share-section {
  justify-content: flex-end; 
  align-items: center; 
  gap: 12px; 
  display: flex;
}

.article-header-wrapper .article-header .share-text {
  color: #333; 
  font-size: 16px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 600; 
  line-height: 24px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .share-icon, 
.article-header-wrapper .article-header .view-icon, 
.article-header-wrapper .article-header .read-time-icon {
  width: 20px; 
  height: 20px; 
  position: relative; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.article-header-wrapper .article-header .icon-image {
  width: 20px;
  height: 20px;
  object-fit: cover;
}

.article-header-wrapper .article-header .share-count {
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 600; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .read-time-section {
  justify-content: flex-start; 
  align-items: center; 
  gap: 6px; 
  display: flex;
}

.article-header-wrapper .article-header .read-time-container {
  border-radius: 30px; 
  justify-content: center; 
  align-items: center; 
  gap: 6px; 
  display: flex;
}

.article-header-wrapper .article-header .read-time-text {
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 600; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .category-author-section {
  align-self: stretch; 
  justify-content: flex-start; 
  align-items: center; 
  gap: 18px; 
  display: inline-flex;
}

.article-header-wrapper .article-header .category-author-wrapper {
  justify-content: center; 
  align-items: flex-end; 
  gap: 610px; 
  display: flex;
}

.article-header-wrapper .article-header .category-author-content {
  width: 752px; 
  justify-content: flex-start; 
  align-items: flex-end; 
  gap: 43px; 
  display: flex;
}

.article-header-wrapper .article-header .category-section {
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 400; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .category-bold {
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 600; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .author-section {
  flex: 1 1 0; 
  justify-content: flex-start; 
  align-items: center; 
  gap: 8px; 
  display: flex;
}

.article-header-wrapper .article-header .author-content {
  flex: 1 1 0; 
  justify-content: space-between; 
  align-items: center; 
  display: flex;
}

.article-header-wrapper .article-header .author-text {
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 400; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .author-bold {
  color: #333; 
  font-size: 14px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 600; 
  line-height: 21px; 
  word-wrap: break-word;
}

.article-header-wrapper .article-header .terms-text {
  color: #333; 
  font-size: 8px; 
  font-family: Gilmer, sans-serif; 
  font-weight: 400; 
  line-height: 11.20px; 
  word-wrap: break-word;
}

/* Hover Effects for Icons - Scoped to article header */
.article-header-wrapper .article-header .share-icon:hover, 
.article-header-wrapper .article-header .view-icon:hover, 
.article-header-wrapper .article-header .read-time-icon:hover {
  cursor: pointer;
}

.article-header-wrapper .article-header .share-icon:hover .icon-image, 
.article-header-wrapper .article-header .view-icon:hover .icon-image, 
.article-header-wrapper .article-header .read-time-icon:hover .icon-image {
  filter: brightness(0.8);
}

/* Figma Share Section Styles - Scoped to article header */
.article-header-wrapper .article-header .frame {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  position: relative;
}

.article-header-wrapper .article-header .frame .group {
  width: 80px;
  position: relative;
  height: 24px;
}

.article-header-wrapper .article-header .frame .group-wrapper .img {
  object-fit: contain;
}

.article-header-wrapper .article-header .frame .text-wrapper {
  position: absolute;
  top: 0;
  left: 32px;
  font-family: Gilmer, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  font-size: 16px;
  letter-spacing: 0;
  line-height: 24px;
  white-space: nowrap;
}

.article-header-wrapper .article-header .frame .img {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 0;
  left: 0;
}

.article-header-wrapper .article-header .frame .group-wrapper {
  width: 62px;
  position: relative;
  height: 24px;
}

.article-header-wrapper .article-header .frame .div {
  width: 64px;
  position: relative;
  height: 24px;
}

.article-header-wrapper .article-header .frame .text-wrapper-2 {
  position: absolute;
  top: 0;
  left: 29px;
  font-family: Gilmer, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  letter-spacing: 0px;
  line-height: 150%;
  white-space: nowrap;
  font-style: normal;
}

.article-header-wrapper .article-header .frame .frame-wrapper {
  gap: 10px;
  display: inline-flex;
  align-items: center;
  position: relative;
  flex: 0 0 auto;
}

.article-header-wrapper .article-header .frame .div-2 {
  justify-content: center;
  gap: 5px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  position: relative;
  flex: 0 0 auto;
}

.article-header-wrapper .article-header .frame .clock-timer {
  position: relative;
  width: 24px;
  height: 24px;
}

.article-header-wrapper .article-header .frame .text-wrapper-3 {
  position: relative;
  width: fit-content;
  font-family: Gilmer, sans-serif;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  font-size: 14px;
  letter-spacing: 0px;
  line-height: 150%;
  white-space: nowrap;
  font-style: normal;
}

/* Hover effects for Figma elements - Scoped to article header */
.article-header-wrapper .article-header .frame .group:hover {
  cursor: pointer;
}

.article-header-wrapper .article-header .frame .group:hover .img,
.article-header-wrapper .article-header .frame .group:hover .text-wrapper {
  filter: brightness(0.8);
}

/* Responsive Design - Scoped to article header */
@media (width <= 768px) {
  .article-header-wrapper .article-header .category-author-wrapper {
    gap: 20px;
  }
  
  .article-header-wrapper .article-header .category-author-content {
    width: 100%;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .article-header-wrapper .article-header .date-share-section {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .article-header-wrapper .article-header .dates-container {
    width: 100%;
  }
  
  .article-header-wrapper .article-header .frame {
    gap: 16px;
  }
  
  .article-header-wrapper .article-header .frame .group {
    width: 70px;
  }
  
  .article-header-wrapper .article-header .frame .text-wrapper {
    left: 28px;
  }
  
  .article-header-wrapper .article-header .frame .group-wrapper {
    width: 58px;
  }
  
  .article-header-wrapper .article-header .frame .text-wrapper-2 {
    left: 25px;
  }
}
  `;

  // Check if styles already exist
  if (!document.querySelector('#article-header-styles')) {
    const style = document.createElement('style');
    style.id = 'article-header-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
  const rows = [...block.children];

  // Extract data from AEM structure
  const title = rows[0]?.querySelector('p')?.textContent;
  const author = rows[1]?.querySelector('p')?.textContent;
  const postedDate = rows[2]?.querySelector('p')?.textContent;
  const updatedDate = rows[3]?.querySelector('p')?.textContent;

  // Extract icon images
  const shareIcon = rows[4]?.querySelector('img');
  const viewIcon = rows[5]?.querySelector('img');
  const timeIcon = rows[6]?.querySelector('img');

  // Build the container with exact structure
  const wrapper = document.createElement('div');
  wrapper.className = 'article-header-wrapper';

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

  // Share Section Frame
  const shareSection = document.createElement('div');
  shareSection.className = 'frame';

  // Share Group
  const shareGroup = document.createElement('div');
  shareGroup.className = 'group';

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

  // Views Group
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

  // Time Group
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

  // Assemble share section
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

  // Build complete structure
  metaInfo.appendChild(dateShareSection);
  metaInfo.appendChild(categoryAuthorSection);
  titleSection.appendChild(articleTitle);
  titleSection.appendChild(metaInfo);
  headerContent.appendChild(titleSection);
  articleHeader.appendChild(headerContent);
  wrapper.appendChild(articleHeader);

  // Replace original block - exactly like products.js
  block.textContent = '';
  block.appendChild(wrapper);

  // Move instrumentation for tracking
  moveInstrumentation(block, wrapper);
}
