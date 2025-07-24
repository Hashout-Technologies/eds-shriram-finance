import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Create notifications container
  const notificationsContainer = document.createElement('div');
  notificationsContainer.className = 'notifications-container';

  // Create header
  const header = document.createElement('div');
  header.className = 'notifications-header';

  const title = document.createElement('h3');
  title.className = 'notifications-title';
  title.textContent = 'Notifications';

  const badge = document.createElement('span');
  badge.className = 'notifications-badge';
  badge.textContent = block.children.length;

  const closeButton = document.createElement('button');
  closeButton.className = 'notifications-close';
  closeButton.innerHTML = '×';
  closeButton.setAttribute('aria-label', 'Close notifications');

  header.appendChild(title);
  header.appendChild(badge);
  header.appendChild(closeButton);

  // Create notifications list
  const notificationsList = document.createElement('ul');
  notificationsList.className = 'notifications-list';

  // Process each notification item
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'notification-item';
    moveInstrumentation(row, li);

    // Extract content from the row
    const messageDiv = row.querySelector(':scope > div:nth-child(1)');
    const callToActionDiv = row.querySelector(':scope > div:nth-child(2)');
    const timestampDiv = row.querySelector(':scope > div:nth-child(3)');

    if (messageDiv) {
      const message = document.createElement('div');
      message.className = 'notification-message';
      message.innerHTML = messageDiv.innerHTML;
      li.appendChild(message);
    }

    if (callToActionDiv) {
      const callToAction = document.createElement('div');
      callToAction.className = 'notification-call-to-action';
      callToAction.innerHTML = callToActionDiv.innerHTML;
      li.appendChild(callToAction);
    }

    if (timestampDiv) {
      const timestamp = document.createElement('div');
      timestamp.className = 'notification-timestamp';
      timestamp.innerHTML = timestampDiv.innerHTML;
      li.appendChild(timestamp);
    }

    notificationsList.appendChild(li);
  });

  // Add scroll indicator
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'notifications-scroll-indicator';

  // Assemble the notifications panel
  notificationsContainer.appendChild(header);
  notificationsContainer.appendChild(notificationsList);
  notificationsContainer.appendChild(scrollIndicator);

  // Clear block and append the new structure
  block.textContent = '';
  block.appendChild(notificationsContainer);

  // Add close functionality
  closeButton.addEventListener('click', () => {
    notificationsContainer.classList.add('notifications-hidden');
  });
}
