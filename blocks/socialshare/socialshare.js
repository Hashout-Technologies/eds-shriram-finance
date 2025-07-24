export default function decorate(block) {
  const icons = block.querySelectorAll('.socialshare picture img');
  const currentURL = window.location.href;
  const encodedURL = encodeURIComponent(currentURL);
  const shareLinks = [
    `https://x.com/intent/post?url=${encodedURL}`,
    `https://www.facebook.com/share.php?u=${encodedURL}`,
    `https://www.instagram.com/accounts/login/?next=${encodedURL}`,
    `https://www.linkedin.com/share/?url=${encodedURL}`,
  ];
  icons.forEach((icon, index) => {
    if (index < shareLinks.length) {
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(shareLinks[index], '_blank', 'noopener,noreferrer');
      });
    }
  });
  const thirdDiv = block.querySelector('.socialshare > div:nth-child(3)');
  if (thirdDiv) {
    thirdDiv.style.cursor = 'pointer';
    thirdDiv.title = 'Click to copy link';
    const innerWrapper = thirdDiv.querySelector('div');
    if (innerWrapper) {
      // Create the link display element
      const urlDisplay = document.createElement('span');
      urlDisplay.textContent = currentURL;
      urlDisplay.className = 'socialshare-url';
      urlDisplay.style.maxWidth = '200px';
      urlDisplay.style.overflow = 'hidden';
      urlDisplay.style.textOverflow = 'ellipsis';
      urlDisplay.style.whiteSpace = 'nowrap';
      urlDisplay.style.display = 'inline-block';
      urlDisplay.style.fontSize = '0.85em';
      urlDisplay.style.color = '#333';
      // Insert as sibling of innerWrapper
      thirdDiv.prepend(urlDisplay);
    }
    thirdDiv.addEventListener('click', () => {
      navigator.clipboard.writeText(currentURL).then(() => {
        thirdDiv.setAttribute('aria-label', 'Link copied!');
        thirdDiv.style.opacity = '0.6';
        setTimeout(() => {
          thirdDiv.style.opacity = '1';
          thirdDiv.removeAttribute('aria-label');
        }, 1000);
      });
    });
  }
}
