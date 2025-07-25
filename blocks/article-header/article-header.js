import { createOptimizedPicture } from '../../scripts/aem.js';
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
              <div class="article-header-div-3">
                <div class="article-header-div-4">
                  <p class="article-header-p">
                    <span class="article-header-span">Posted: </span> <span class="article-header-text-wrapper-2">${postedDate}</span>
                  </p>
                  <p class="article-header-p">
                    <span class="article-header-span">Updated: </span> <span class="article-header-text-wrapper-2">${updatedDate}</span>
                  </p>
                </div>
                <div class="article-header-div-5">
                  <div class="article-header-group">
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
              <div class="article-header-div-wrapper">
                <div class="article-header-frame-wrapper-2">
                  <div class="article-header-div-7">
                    <p class="article-header-p">
                      <span class="article-header-span">Category: </span> <span class="article-header-text-wrapper-2">Gold Loan</span>
                    </p>
                    <p class="article-header-p">
                      <span class="article-header-span">Written by: </span> <span class="article-header-text-wrapper-2">${author}</span>
                    </p>
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
  
  // Add click functionality to share
  const shareGroup = frame.querySelector('.article-header-group');
  if (shareGroup) {
    shareGroup.style.cursor = 'pointer';
    shareGroup.onclick = () => {
      if (navigator.share) {
        navigator.share({
          title: title,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    };
  }
  
  // Clear the block and add new content
  block.textContent = '';
  block.appendChild(frame);
  
  // Move instrumentation for tracking
  moveInstrumentation(block, frame);
}