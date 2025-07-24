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

  const container = document.createElement('div');
  container.className = 'notifications-header-container';

  const closeButton = document.createElement('button');
  closeButton.className = 'notifications-close';
  closeButton.innerHTML = '×';
  closeButton.setAttribute('aria-label', 'Close notifications');

  container.appendChild(title);
  container.appendChild(badge);
  header.appendChild(container);
  header.appendChild(closeButton);

  // Create notifications list
  const notificationsList = document.createElement('ul');
  notificationsList.className = 'notifications-list';

  // Process each notification item
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'notification-item';
    moveInstrumentation(row, li);

    // Extract content from the row based on field names
    const messageDiv = row.querySelector('[data-field="message"]') || row.querySelector(':scope > div:nth-child(1)');
    const callToActionDiv = row.querySelector('[data-field="callToAction"]') || row.querySelector(':scope > div:nth-child(2)');
    const callToActionLinkDiv = row.querySelector('[data-field="callToActionLink"]') || row.querySelector(':scope > div:nth-child(3)');
    const timestampDiv = row.querySelector('[data-field="timestamp"]') || row.querySelector(':scope > div:nth-child(4)');

    // Add message
    if (messageDiv) {
      const message = document.createElement('div');
      message.className = 'notification-message';
      message.innerHTML = messageDiv.innerHTML;
      li.appendChild(message);
    }

    // Add call to action with link
    if (callToActionDiv || callToActionLinkDiv) {
      const callToAction = document.createElement('div');
      callToAction.className = 'notification-call-to-action';

      // If we have both text and link, combine them
      if (callToActionDiv && callToActionLinkDiv) {
        const link = callToActionLinkDiv.querySelector('a');
        if (link) {
          const text = callToActionDiv.textContent.trim() || 'Invest Now';
          link.textContent = text;
          callToAction.appendChild(link);
        } else {
          callToAction.innerHTML = callToActionLinkDiv.innerHTML;
        }
      } else if (callToActionLinkDiv) {
        // Only link available
        callToAction.innerHTML = callToActionLinkDiv.innerHTML;
      } else if (callToActionDiv) {
        // Only text available
        callToAction.innerHTML = callToActionDiv.innerHTML;
      }

      li.appendChild(callToAction);
    }

    // Add timestamp
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

  // Update notification badges after processing
  const updateNotificationBadges = () => {
    const notificationIcons = document.querySelectorAll('.icon-notification, [data-icon="notification"], .notification-icon');
    notificationIcons.forEach((icon) => {
      // Count the number of notification items
      const notificationItems = block.querySelectorAll('.notification-item');
      const count = notificationItems.length;

      // Remove existing badge if it exists
      const existingBadge = icon.querySelector('.notification-badge');
      if (existingBadge) {
        existingBadge.remove();
      }

      // Only create badge if count is greater than 0
      if (count > 0) {
        const countBadge = document.createElement('span');
        countBadge.className = 'notification-badge';
        countBadge.textContent = count;
        countBadge.setAttribute('aria-label', `${count} unread notifications`);
        icon.appendChild(countBadge);
      }
    });
  };

  // Update badges after processing
  updateNotificationBadges();
}
