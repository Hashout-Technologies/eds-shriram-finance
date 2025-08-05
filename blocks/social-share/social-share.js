export default function decorate(block) {
  const icons = block.querySelectorAll('.social-share > div:nth-child(2) picture img');
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

  const thirdDiv = block.querySelector('.social-share > div:nth-child(3)');
  if (thirdDiv) {
    thirdDiv.style.cursor = 'pointer';
    thirdDiv.title = 'Click to copy link';

    const innerWrapper = thirdDiv.querySelector('div');
    if (innerWrapper) {
      // Create the link display element
      const urlDisplay = document.createElement('span');
      urlDisplay.textContent = currentURL;
      urlDisplay.className = 'socialshare-url';
      urlDisplay.style.maxWidth = '12.5rem';
      urlDisplay.style.overflow = 'hidden';
      urlDisplay.style.textOverflow = 'ellipsis';
      urlDisplay.style.whiteSpace = 'nowrap';
      urlDisplay.style.display = 'inline-block';
      urlDisplay.style.fontSize = '0.85em';
      urlDisplay.style.color = '#333';

      thirdDiv.prepend(urlDisplay);
    }

    thirdDiv.addEventListener('click', () => {
      navigator.clipboard.writeText(currentURL).then(() => {
        thirdDiv.setAttribute('aria-label', 'Link copied!');

        const targetDiv = thirdDiv.querySelector('div:last-of-type');
        if (targetDiv) {
          targetDiv.style.background = '#4CAF50';
        }

        const iconPara = thirdDiv.querySelector('div:last-of-type > p:first-of-type');
        if (iconPara) {
          iconPara.innerHTML = '<img src="/icons/tick.svg" alt="check icon" width="16" height="16" />';
        }

        // Change the text from "Copy link" to "Link Copied"
        const textPara = thirdDiv.querySelector('div:last-of-type > p:last-of-type');
        if (textPara) {
          textPara.textContent = 'Link Copied';
          textPara.style.color = '#fff';
        }
      });
    });
  }
}
