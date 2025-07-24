export default function decorate(block) {
  // Get data attributes from the block (set by Universal Editor)
  const data = {
    title: block.dataset.title || block.querySelector('[data-title]')?.textContent || 'Article Title',
    category: block.dataset.category || block.querySelector('[data-category]')?.textContent || '',
    author: block.dataset.author || block.querySelector('[data-author]')?.textContent || '',
    posteddate: block.dataset.posteddate || block.querySelector('[data-posted-date]')?.textContent || '',
    updateddate: block.dataset.updateddate || block.querySelector('[data-updated-date]')?.textContent || '',
    viewcount: block.dataset.viewcount || block.querySelector('[data-view-count]')?.textContent || '',
    readingtime: block.dataset.readingtime || block.querySelector('[data-reading-time]')?.textContent || '',
    shareicon: block.dataset.shareicon || block.querySelector('[data-share-icon]') || null,
    viewicon: block.dataset.viewicon || block.querySelector('[data-view-icon]') || null,
    timeicon: block.dataset.timeicon || block.querySelector('[data-time-icon]') || null
  };

  // Create the article header structure
  const articleHeader = document.createElement('div');
  articleHeader.className = 'article-header-container';

  // Main title
  const title = document.createElement('h1');
  title.className = 'article-title';
  title.textContent = data.title;

  // Meta information container
  const metaContainer = document.createElement('div');
  metaContainer.className = 'article-meta';

  // Left side - dates and category
  const leftMeta = document.createElement('div');
  leftMeta.className = 'meta-left';

  // Posted date
  if (data.posteddate) {
    const posted = document.createElement('span');
    posted.className = 'meta-item posted-date';
    posted.innerHTML = `Posted: <strong>${data.posteddate}</strong>`;
    leftMeta.appendChild(posted);
  }

  // Updated date
  if (data.updateddate) {
    const updated = document.createElement('span');
    updated.className = 'meta-item updated-date';
    updated.innerHTML = `Updated: <strong>${data.updateddate}</strong>`;
    leftMeta.appendChild(updated);
  }

  // Category
  if (data.category) {
    const category = document.createElement('div');
    category.className = 'article-category';
    category.innerHTML = `Category: <strong>${data.category}</strong>`;
    leftMeta.appendChild(category);
  }

  // Right side - interactive elements and author
  const rightMeta = document.createElement('div');
  rightMeta.className = 'meta-right';

  // Share button
  const shareButton = document.createElement('button');
  shareButton.className = 'meta-item share-btn';
  shareButton.onclick = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title || document.title,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (data.shareicon) {
    const shareImg = document.createElement('img');
    shareImg.src = data.shareicon;
    shareImg.className = 'meta-icon';
    shareImg.alt = 'Share';
    shareButton.appendChild(shareImg);
  }
  shareButton.appendChild(document.createTextNode(' Share'));

  // View count
  if (data.viewcount) {
    const viewCount = document.createElement('span');
    viewCount.className = 'meta-item view-count';
    
    if (data.viewicon) {
      const viewImg = document.createElement('img');
      viewImg.src = data.viewicon;
      viewImg.className = 'meta-icon';
      viewImg.alt = 'Views';
      viewCount.appendChild(viewImg);
    }
    viewCount.appendChild(document.createTextNode(` ${data.viewcount}`));
    rightMeta.appendChild(viewCount);
  }

  // Reading time
  if (data.readingtime) {
    const readingTime = document.createElement('span');
    readingTime.className = 'meta-item reading-time';
    
    if (data.timeicon) {
      const timeImg = document.createElement('img');
      timeImg.src = data.timeicon;
      timeImg.className = 'meta-icon';
      timeImg.alt = 'Reading time';
      readingTime.appendChild(timeImg);
    }
    readingTime.appendChild(document.createTextNode(` ${data.readingtime} Min`));
    rightMeta.appendChild(readingTime);
  }

  rightMeta.appendChild(shareButton);

  // Author information
  if (data.author) {
    const author = document.createElement('div');
    author.className = 'article-author';
    author.innerHTML = `Written by: <strong>${data.author}</strong>`;
    rightMeta.appendChild(author);
  }

  // Assemble the components
  metaContainer.appendChild(leftMeta);
  metaContainer.appendChild(rightMeta);
  
  articleHeader.appendChild(title);
  articleHeader.appendChild(metaContainer);

  // Replace block content
  block.innerHTML = '';
  block.appendChild(articleHeader);
}