import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Extract data from AEM structure
  const title = rows[0]?.querySelector('p')?.textContent || '';
  const author = rows[1]?.querySelector('p')?.textContent || '';
  const postedDate = rows[2]?.querySelector('p')?.textContent || '';
  const updatedDate = rows[3]?.querySelector('p')?.textContent || '';

  // Extract icon images
  const shareIcon = rows[4]?.querySelector('img');
  const viewIcon = rows[5]?.querySelector('img');
  const timeIcon = rows[6]?.querySelector('img');

  // Get icon sources
  const shareIconSrc = shareIcon ? shareIcon.src : '';
  const viewIconSrc = viewIcon ? viewIcon.src : '';
  const timeIconSrc = timeIcon ? timeIcon.src : '';

  // Create HTML template
  const htmlTemplate = `
    <div class="article-header-wrapper">
      <div class="article-header">
        <div class="header-content">
          <div class="title-section">
            <div class="article-title">${title}</div>
            <div class="meta-info">
              <div class="date-share-section">
                <div class="dates-container">
                  <div class="posted-date">Posted: <span class="date-bold">${postedDate}</span></div>
                  <div class="updated-date-container">
                    <div class="updated-date">Updated: <span class="date-bold">${updatedDate}</span></div>
                    <div class="updated-date-duplicate">Updated: <span class="date-bold">${updatedDate}</span></div>
                  </div>
                </div>
                <div class="frame">
                  <div class="group" style="cursor: pointer;">
                    <div class="text-wrapper">Share</div>
                    <img class="img" alt="Share" src="${shareIconSrc}" />
                  </div>
                  <div class="group-wrapper">
                    <div class="div">
                      <div class="text-wrapper-2">2202</div>
                      <img class="img" alt="Views" src="${viewIconSrc}" />
                    </div>
                  </div>
                  <div class="frame-wrapper">
                    <div class="div-2">
                      <img class="clock-timer" alt="Time" src="${timeIconSrc}" />
                      <div class="text-wrapper-3">3 Min</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="category-author-section">
                <div class="category-author-wrapper">
                  <div class="category-author-content">
                    <div class="category-section">Category: <span class="category-bold">Gold Loan</span></div>
                    <div class="author-section">
                      <div class="author-content">
                        <div class="author-text">Written by: <span class="author-bold">${author}</span></div>
                        <div class="terms-text">*T&C Apply</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

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

  // Clear the block and set new content
  block.innerHTML = htmlTemplate;

  // Add click functionality to share after HTML is set
  const shareGroup = block.querySelector('.group');
  if (shareGroup) {
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
  }

  // Move instrumentation for tracking
  moveInstrumentation(block, block.querySelector('.article-header-wrapper'));
}
