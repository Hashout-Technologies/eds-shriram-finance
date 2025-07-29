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

  // Create the exact HTML structure with namespaced classes
  const frame = document.createElement('div');
  frame.className = 'article-header-frame';

  frame.innerHTML = `
    <div class="article-header-div">
      <div class="article-header-div-2">
        <div class="article-header-div">
          <div class="article-header-div">
            <p class="article-header-text-wrapper">${title}</p>
            <div class="article-header-div">
              <div class="article-header-row">
                <div class="article-header-left">
                  <div class="article-header-date-item">
                    <p class="article-header-p">
                      <span class="article-header-span">Posted: </span> <span class="article-header-text-wrapper-2">${postedDate}</span>
                    </p>
                  </div>
                  <div class="article-header-date-item">
                    <p class="article-header-p">
                      <span class="article-header-span">Updated: </span> <span class="article-header-text-wrapper-2">${updatedDate}</span>
                    </p>
                  </div>
                </div>
                <div class="article-header-right">
                  <div class="article-header-group" style="cursor: pointer;">
                    <div class="article-header-text-wrapper-3">Share</div>
                    <img class="article-header-img article-header-share-icon" src="" />
                  </div>
                  <div class="article-header-group-wrapper">
                    <div class="article-header-group-2">
                      <div class="article-header-text-wrapper-4">2202</div>
                      <img class="article-header-img article-header-view-icon" src="" />
                    </div>
                  </div>
                  <div class="article-header-frame-wrapper">
                    <div class="article-header-div-6">
                      <img class="article-header-clock-timer article-header-time-icon" src="" />
                      <div class="article-header-text-wrapper-5">3 Min</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="article-header-row">
                <div class="article-header-left">
                  <div class="article-header-date-item">
                    <p class="article-header-p">
                      <span class="article-header-span">Category: </span> <span class="article-header-text-wrapper-2">Gold Loan</span>
                    </p>
                  </div>
                  <div class="article-header-date-item">
                    <p class="article-header-p">
                      <span class="article-header-span">Written by: </span> <span class="article-header-text-wrapper-2">${author}</span>
                    </p>
                  </div>
                </div>
                <div class="article-header-right">
                  <div class="article-header-tnc-wrapper">
                    <div class="article-header-tnc-text">*T&C Apply</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set the icon sources from AEM data
  if (shareIcon) {
    const shareImg = frame.querySelector('.article-header-share-icon');
    shareImg.src = shareIcon.src;
    shareImg.alt = 'Share';
  }

  if (viewIcon) {
    const viewImg = frame.querySelector('.article-header-view-icon');
    viewImg.src = viewIcon.src;
    viewImg.alt = 'Views';
  }

  if (timeIcon) {
    const timeImg = frame.querySelector('.article-header-time-icon');
    timeImg.src = timeIcon.src;
    timeImg.alt = 'Reading time';
  }

  // Helper function to show user feedback
  function showCopyFeedback() {
    // Create a temporary toast-like notification
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

    // Remove notification after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Add click functionality to share
  const shareGroup = frame.querySelector('.article-header-group');
  if (shareGroup) {
    shareGroup.style.cursor = 'pointer';
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
            // Fallback for older browsers - silently fail
            showCopyFeedback();
          });
      }
    };
  }

  // Clear the block and add new content
  block.textContent = '';
  block.appendChild(frame);

  // Move instrumentation for tracking
  moveInstrumentation(block, frame);
}
