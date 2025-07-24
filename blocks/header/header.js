import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Constants
const DESKTOP_BREAKPOINT = '(min-width: 900px)';
const NAV_CLASSES = ['brand', 'sections', 'tools'];

// Media query for desktop detection
const isDesktop = window.matchMedia(DESKTOP_BREAKPOINT);

/**
 * Toggles all navigation sections
 */
function toggleAllNavSections(sections, expanded = false) {
  const navItems = sections.querySelectorAll(
    '.nav-sections .default-content-wrapper > ul > li',
  );
  navItems.forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Handles sidebar closure when Escape key is pressed
 */
function handleEscapeKey(e) {
  if (e.code !== 'Escape') return;

  const nav = document.getElementById('nav');
  const sidebar = nav.querySelector('.nav-sidebar');

  if (!isDesktop.matches && sidebar) {
    // eslint-disable-next-line no-use-before-define
    toggleSidebar(nav, sidebar, false).then(() => {
      nav.querySelector('button').focus();
    });
  }
}

/**
 * Handles sidebar closure when focus is lost
 */
function handleFocusLost(e) {
  const nav = e.currentTarget;

  if (!nav.contains(e.relatedTarget)) {
    const sidebar = nav.querySelector('.nav-sidebar');

    if (!isDesktop.matches && sidebar) {
      // eslint-disable-next-line no-use-before-define
      toggleSidebar(nav, sidebar, false);
    }
  }
}

/**
 * Manages event listeners for menu collapse
 */
function handleEventListeners(nav, isExpanded) {
  if (isExpanded || isDesktop.matches) {
    window.addEventListener('keydown', handleEscapeKey);
    nav.addEventListener('focusout', handleFocusLost);
  } else {
    window.removeEventListener('keydown', handleEscapeKey);
    nav.removeEventListener('focusout', handleFocusLost);
  }
}

/**
 * Toggles the sidebar visibility and accessibility
 */
const toggleSidebar = async (nav, sidebar, forceExpanded = null) => {
  const isCurrentlyExpanded = nav.getAttribute('aria-expanded') === 'true';
  const shouldExpand = forceExpanded !== null ? forceExpanded : !isCurrentlyExpanded;

  const button = nav.querySelector('.nav-hamburger button');
  const placeholders = await fetchPlaceholders();

  // Update body overflow and add overlay for mobile
  if (!isDesktop.matches) {
    if (shouldExpand) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }

    // Add/remove overlay
    let overlay = document.querySelector('.sidebar-overlay');
    if (shouldExpand && !overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.addEventListener('click', () => toggleSidebar(nav, sidebar, false));
      document.body.appendChild(overlay);
    } else if (!shouldExpand && overlay) {
      overlay.remove();
    }
  }

  // Update nav state
  nav.setAttribute('aria-expanded', shouldExpand);

  // Toggle sidebar visibility with improved animation
  if (sidebar) {
    if (shouldExpand) {
      sidebar.classList.remove('sidebar-hidden');
      sidebar.classList.add('sidebar-visible');
      // Trigger animation after display is set
      setTimeout(() => {
        sidebar.classList.add('sidebar-open');
      }, 10);
    } else {
      sidebar.classList.remove('sidebar-open');
      // Wait for animation to complete before hiding
      setTimeout(() => {
        if (!sidebar.classList.contains('sidebar-open')) {
          sidebar.classList.remove('sidebar-visible');
          sidebar.classList.add('sidebar-hidden');
        }
      }, 300);
    }
  }

  // Update button label
  const labelKey = shouldExpand ? 'navCloseLabel' : 'navOpenLabel';
  const defaultLabel = shouldExpand ? 'Close sidebar' : 'Open sidebar';
  button.setAttribute('aria-label', placeholders[labelKey] || defaultLabel);

  // Handle event listeners
  handleEventListeners(nav, shouldExpand);
};

/**
 * Hides all grandchildren (deeper nested levels) within a children container
 */
function hideGrandchildren(childrenContainer) {
  const grandchildren = childrenContainer.querySelectorAll('li > ul');
  grandchildren.forEach((grandchild) => {
    grandchild.classList.remove('grandchildren-visible');
    grandchild.classList.add('grandchildren-hidden');
  });
}

/**
 * Shows all grandchildren (deeper nested levels) within a children container
 */
function showGrandchildren(childrenContainer) {
  const grandchildren = childrenContainer.querySelectorAll('li > ul');
  grandchildren.forEach((grandchild) => {
    grandchild.classList.remove('grandchildren-hidden');
    grandchild.classList.add('grandchildren-visible');
  });
}

/**
 * Updates the dropdown height dynamically based on content
 */
function updateDropdownHeight(mainDropdown) {
  // Get the parent dropdown container (the main dropdown ul)
  const dropdownContainer = mainDropdown.closest('ul');
  if (!dropdownContainer) return;

  // Calculate the height needed for the content
  let maxHeight = 0;

  // Get all visible submenu children containers
  const visibleChildren = dropdownContainer.querySelectorAll(
    'li > ul.submenu-children-visible',
  );

  visibleChildren.forEach((childrenContainer) => {
    // Get the actual scroll height of the content
    const contentHeight = childrenContainer.scrollHeight;
    maxHeight = Math.max(maxHeight, contentHeight);
  });

  // Add padding and minimum height considerations
  const padding = 24; // 32px top + 32px bottom
  const minHeight = 200;
  const calculatedHeight = Math.max(maxHeight + padding, minHeight);

  // Set the height on the main dropdown container
  dropdownContainer.style.height = `${calculatedHeight}px`;
}

/**
 * Resets the dropdown height when it closes
 */
function resetDropdownHeight(navSection) {
  const dropdown = navSection.querySelector('ul');
  if (dropdown) {
    dropdown.classList.remove('dropdown-height-auto');
    dropdown.style.height = 'auto';
  }
}

/**
 * Sets up hover events for submenu items to show only their children
 */
function setupSubmenuHoverEvents(navSection) {
  // Get the main dropdown ul (first level submenu)
  const mainDropdown = navSection.querySelector('ul');
  if (!mainDropdown) return;

  // Only target direct children of the main dropdown
  // (submenu items like "General Insurance", "Life Insurance")
  const submenuItems = mainDropdown.querySelectorAll(':scope > li');

  submenuItems.forEach((submenuItem) => {
    // Only target the immediate children ul
    // (like "Motor Insurance", "Non Motor Insurance" containers)
    const submenuChildren = submenuItem.querySelector(':scope > ul');

    // Handle submenu items without children (leaf nodes)
    if (!submenuChildren) {
      // Add class to identify leaf nodes
      submenuItem.classList.add('nav-leaf');

      // Check if there's a direct anchor tag (like in Calculators dropdown)
      const directAnchor = submenuItem.querySelector(':scope > a');
      if (directAnchor) {
        // The styling is now handled by CSS classes
        return;
      }

      // Fallback: Find the paragraph element and convert it to a link if it contains an anchor
      const submenuParagraph = submenuItem.querySelector(':scope > p');
      if (submenuParagraph) {
        const anchor = submenuParagraph.querySelector('a');
        if (anchor) {
          // Add click handler to the paragraph
          submenuParagraph.addEventListener('click', (e) => {
            e.preventDefault();
            anchor.click();
          });
        }
      }
      return;
    }

    // Initially hide all submenu children and their grandchildren
    submenuChildren.classList.remove('submenu-children-visible');
    submenuChildren.classList.add('submenu-children-hidden');
    hideGrandchildren(submenuChildren);

    // Show first submenu's children by default
    if (submenuItem === submenuItems[0]) {
      submenuChildren.classList.remove('submenu-children-hidden');
      submenuChildren.classList.add('submenu-children-visible');
      submenuChildren.classList.add('submenu-visible');
      showGrandchildren(submenuChildren);
      submenuItem.classList.add('active');
      updateDropdownHeight(mainDropdown);
    }

    // Add hover events for submenu items
    submenuItem.addEventListener('mouseenter', () => {
      // Hide all submenu children and their grandchildren first
      submenuItems.forEach((item) => {
        const children = item.querySelector(':scope > ul');
        if (children) {
          children.classList.remove('submenu-children-visible');
          children.classList.add('submenu-children-hidden');
          hideGrandchildren(children);
        }
        item.classList.remove('active');
      });

      // Show children and grandchildren of current submenu item
      submenuChildren.classList.remove('submenu-children-hidden');
      submenuChildren.classList.add('submenu-children-visible');
      showGrandchildren(submenuChildren);
      submenuItem.classList.add('active');

      // Update dropdown height based on new content
      updateDropdownHeight(mainDropdown);

      // Add smooth transition effect
      submenuChildren.classList.add('submenu-transition');
      submenuChildren.classList.remove('submenu-visible');
      setTimeout(() => {
        submenuChildren.classList.add('submenu-visible');
      }, 10);
    });
  });
}

/**
 * Sets up desktop hover events for dropdown menus
 */
function setupDesktopDropdownEvents(navSection, navSections) {
  let hoverTimeout;

  // Mouse enter - show dropdown
  navSection.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);

    // Close other dropdowns first
    toggleAllNavSections(navSections, false);

    // Show current dropdown
    navSection.setAttribute('aria-expanded', 'true');

    // Setup submenu hover events for this dropdown
    setupSubmenuHoverEvents(navSection);
  });

  // Mouse leave - hide dropdown with delay
  navSection.addEventListener('mouseleave', () => {
    hoverTimeout = setTimeout(() => {
      navSection.setAttribute('aria-expanded', 'false');
      // Reset height when dropdown closes
      resetDropdownHeight(navSection);
    }, 150); // Small delay to prevent flickering
  });

  // Handle dropdown content hover
  const dropdown = navSection.querySelector('ul');
  if (dropdown) {
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
    });

    dropdown.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        navSection.setAttribute('aria-expanded', 'false');
        // Reset height when dropdown closes
        resetDropdownHeight(navSection);
      }, 150);
    });
  }
}

/**
 * Extracts direct text content from menu item, excluding nested elements
 */
function getDirectTextContent(menuItem) {
  const menuLink = menuItem.querySelector(':scope > :where(a,p)');

  if (menuLink) {
    return menuLink.textContent.trim();
  }

  return Array.from(menuItem.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join(' ')
    .trim();
}

/**
 * Builds breadcrumb navigation from the navigation tree
 */
async function buildBreadcrumbsFromNavTree(nav, currentUrl) {
  const crumbs = [];
  const homeUrl = document.querySelector('.nav-brand a[href]')?.href;

  if (!homeUrl) return crumbs;

  // Find current page in navigation
  const currentMenuItem = Array.from(nav.querySelectorAll('a')).find(
    (a) => a.href === currentUrl,
  );

  if (currentMenuItem) {
    // Build breadcrumb trail from current item up to root
    let menuItem = currentMenuItem.closest('li');

    while (menuItem) {
      const link = menuItem.querySelector(':scope > a');
      crumbs.unshift({
        title: getDirectTextContent(menuItem),
        url: link?.href || null,
      });
      menuItem = menuItem.closest('ul')?.closest('li');
    }
  } else if (currentUrl !== homeUrl) {
    // Fallback for pages not in navigation
    crumbs.push({
      title: getMetadata('og:title') || document.title,
      url: currentUrl,
    });
  }

  // Add home breadcrumb
  const placeholders = await fetchPlaceholders();
  const homeLabel = placeholders.breadcrumbsHomeLabel || 'Home';
  crumbs.unshift({ title: homeLabel, url: homeUrl });

  // Mark current page (last item should not be linked)
  if (crumbs.length > 1) {
    const lastCrumb = crumbs[crumbs.length - 1];
    lastCrumb.url = null;
    lastCrumb['aria-current'] = 'page';
  }

  return crumbs;
}

/**
 * Creates breadcrumb navigation element
 */
async function buildBreadcrumbs() {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';
  breadcrumbs.setAttribute('aria-label', 'Breadcrumb');

  const navSections = document.querySelector('.nav-sections');
  const crumbs = await buildBreadcrumbsFromNavTree(
    navSections,
    document.location.href,
  );

  const ol = document.createElement('ol');

  crumbs.forEach((item) => {
    const li = document.createElement('li');

    if (item['aria-current']) {
      li.setAttribute('aria-current', item['aria-current']);
    }

    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.append(a);
    } else {
      li.textContent = item.title;
    }

    ol.append(li);
  });

  breadcrumbs.append(ol);
  return breadcrumbs;
}

/**
 * Extracts navigation assets from the columns structure
 */
function extractNavigationAssets(navBrand) {
  const columnsBlock = navBrand?.querySelector('.columns');
  if (!columnsBlock) return {};

  let hamburgerIcon = null;
  let brandLogo = null;
  let toolsContent = null;

  const firstColumn = columnsBlock.querySelector('div > div:first-child');
  if (firstColumn) {
    const images = firstColumn.querySelectorAll('picture');
    if (images.length >= 2) {
      hamburgerIcon = images[0].cloneNode(true);
      brandLogo = images[1].cloneNode(true);
    }
  }

  const secondColumn = columnsBlock.querySelector('div > div:last-child');
  const toolsDiv = secondColumn?.querySelector('div:last-child');
  if (toolsDiv) {
    toolsContent = toolsDiv.cloneNode(true);
  }

  return { hamburgerIcon, brandLogo, toolsContent };
}

/**
 * Creates hamburger menu button
 */
async function createHamburgerButton(hamburgerIcon) {
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');

  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-controls', 'nav');

  const placeholders = await fetchPlaceholders();
  button.setAttribute(
    'aria-label',
    placeholders.navOpenLabel || 'Open navigation',
  );

  if (hamburgerIcon) {
    button.append(hamburgerIcon);
  } else {
    const icon = document.createElement('span');
    icon.classList.add('nav-hamburger-icon');
    button.append(icon);
  }

  hamburger.append(button);
  return hamburger;
}

/**
 * Sets up navigation section event listeners
 */
function setupNavSectionListeners(navSections) {
  const navItems = navSections.querySelectorAll(
    ':scope .default-content-wrapper > ul > li',
  );

  navItems.forEach((navSection) => {
    if (navSection.querySelector('ul')) {
      navSection.classList.add('nav-drop');
    }

    // Desktop: Hover events for dropdowns
    if (isDesktop.matches) {
      setupDesktopDropdownEvents(navSection, navSections);
    } else {
      // Mobile: Click events
      navSection.addEventListener('click', () => {
        const isExpanded = navSection.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navSections, false);
        navSection.setAttribute('aria-expanded', !isExpanded);
      });
    }
  });
}

/**
 * Cleans up button styling in navigation sections
 */
function cleanupButtonStyling(navSections) {
  const buttonContainers = navSections.querySelectorAll('.button-container');
  buttonContainers.forEach((container) => {
    container.classList.remove('button-container');
    const button = container.querySelector('.button');
    if (button) {
      button.classList.remove('button');
    }
  });
}

/**
 * Toggles notifications panel visibility
 */
function toggleNotifications(notificationsBlock, forceVisible = null) {
  const container = notificationsBlock.querySelector('.notifications-container');
  if (!container) return;

  // Check if notifications are currently visible by checking both display and class
  const isCurrentlyVisible = !notificationsBlock.classList.contains('notifications-block-hidden') && !container.classList.contains('notifications-hidden');
  const shouldShow = forceVisible !== null ? forceVisible : !isCurrentlyVisible;

  if (shouldShow) {
    notificationsBlock.classList.remove('notifications-block-hidden');
    notificationsBlock.classList.add('notifications-block-visible');
    container.classList.remove('notifications-hidden');
    // Add click outside to close
    setTimeout(() => {
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('click', handleClickOutside);
    }, 100);
  } else {
    container.classList.add('notifications-hidden');
    notificationsBlock.classList.remove('notifications-block-visible');
    notificationsBlock.classList.add('notifications-block-hidden');
    // eslint-disable-next-line no-use-before-define
    document.removeEventListener('click', handleClickOutside);
  }
}

/**
 * Handles clicks outside the notifications panel
 */
function handleClickOutside(e) {
  // Find all notification icons and check if click is outside any of them
  const notificationIcons = document.querySelectorAll('.icon-notification, [data-icon="notification"], .notification-icon');
  let clickedOutside = true;

  notificationIcons.forEach((icon) => {
    if (icon.contains(e.target)) {
      clickedOutside = false;
    }
  });

  if (clickedOutside) {
    // Find the notifications block and close it
    const notificationsBlock = document.querySelector('.notifications');
    if (notificationsBlock) {
      toggleNotifications(notificationsBlock, false);
    }
  }
}

/**
 * Creates or updates the notification badge
 */
function createNotificationBadge(notificationIcon, count) {
  // Remove existing badge if it exists
  const existingBadge = notificationIcon.querySelector('.notification-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  // Only create badge if count is greater than 0
  if (count > 0) {
    const badge = document.createElement('span');
    badge.className = 'notification-badge';
    badge.textContent = count;
    badge.setAttribute('aria-label', `${count} unread notifications`);
    notificationIcon.appendChild(badge);
  }
}

/**
 * Updates the notification badge count
 */
function updateNotificationBadge(notificationIcon) {
  // Find notifications block - first look inside the icon, then globally
  const notificationsBlock = notificationIcon.querySelector('.notifications') || document.querySelector('.notifications');
  if (!notificationsBlock) return;

  // Count the number of notification items
  const notificationItems = notificationsBlock.querySelectorAll('.notification-item');
  const count = notificationItems.length;

  createNotificationBadge(notificationIcon, count);
}

/**
 * Sets up notification icon click functionality
 */
function setupNotificationIcon(notificationIcon) {
  // Find notifications block - first look inside the icon, then globally
  const notificationsBlock = notificationIcon.querySelector('.notifications') || document.querySelector('.notifications');

  if (!notificationsBlock) {
    // Store the icon for later setup when notifications block is available
    if (!window.pendingNotificationIcons) {
      window.pendingNotificationIcons = [];
    }
    window.pendingNotificationIcons.push(notificationIcon);
    return;
  }

  // Create initial badge
  updateNotificationBadge(notificationIcon);

  // Add click event to notification icon
  notificationIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNotifications(notificationsBlock);
  });

  // Add keyboard support
  notificationIcon.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleNotifications(notificationsBlock);
    }
  });
}

/**
 * Processes the notifications block from header content
 */
function processNotificationsBlock(notificationsBlock) {
  // Find notification icons to attach the notifications block to
  const notificationIcons = document.querySelectorAll('.icon-notification, [data-icon="notification"], .notification-icon');

  if (notificationIcons.length > 0) {
    // Move notifications block to the first notification icon
    const firstIcon = notificationIcons[0];
    firstIcon.appendChild(notificationsBlock);
  } else {
    // Fallback: move to body if no notification icon found
    document.body.appendChild(notificationsBlock);
  }

  // Add close functionality to the close button
  const closeButton = notificationsBlock.querySelector('.notifications-close');
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleNotifications(notificationsBlock, false);
    });
  }

  // Initially hide the notifications and ensure proper initial state
  notificationsBlock.classList.add('notifications-block-hidden');
  const container = notificationsBlock.querySelector('.notifications-container');
  if (container) {
    container.classList.add('notifications-hidden');
  }

  // Update notification badges after processing
  notificationIcons.forEach((icon) => {
    updateNotificationBadge(icon);
  });

  // Setup any pending notification icons that were waiting for the notifications block
  if (window.pendingNotificationIcons && window.pendingNotificationIcons.length > 0) {
    window.pendingNotificationIcons.forEach((icon) => {
      setupNotificationIcon(icon);
    });
    window.pendingNotificationIcons = []; // Clear the pending list
  }
}

/**
 * Sets up navigation tools section
 */
function setupNavTools(navTools) {
  if (!navTools) return;

  const searchLink = navTools.querySelector('a[href*="search"]');
  if (searchLink && !searchLink.textContent.trim()) {
    searchLink.setAttribute('aria-label', 'Search');
  }

  // Setup notification icon functionality
  const notificationIcon = navTools.querySelector('.icon-notification, [data-icon="notification"], .notification-icon');

  if (notificationIcon) {
    setupNotificationIcon(notificationIcon);
  }
}

/**
 * Main decoration function - loads and sets up the header navigation
 */
export default async function decorate(block) {
  // Load navigation fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Create main navigation element
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  // Move fragment content to nav
  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  // Add standard navigation classes
  NAV_CLASSES.forEach((className, index) => {
    const section = nav.children[index];
    if (section) {
      section.classList.add(`nav-${className}`);
    }
  });

  // Setup individual navigation sections
  const navBrand = nav.querySelector('.nav-brand');
  const navSections = nav.querySelector('.nav-sections');
  const navTools = nav.querySelector('.nav-tools');
  const sidebar = nav.querySelector('.sidebar');

  // Clean up brand section
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink
        .closest('.button-container')
        ?.classList.remove('button-container');
    }
  }

  // Setup navigation sections
  if (navSections) {
    setupNavSectionListeners(navSections);
    cleanupButtonStyling(navSections);
  }

  // Setup navigation tools
  setupNavTools(navTools);

  // Remove sidebar from navTools if it exists
  if (navTools && sidebar) {
    sidebar.remove();
  }

  // Extract navigation assets and create structure
  const { hamburgerIcon, brandLogo, toolsContent } = extractNavigationAssets(navBrand);

  // Setup notification icon from toolsContent (which comes from navBrand columns)
  if (toolsContent) {
    setupNavTools(toolsContent);
  }

  // Capture notifications block before rebuilding navigation structure
  const capturedNotificationsBlock = nav.querySelector('.notifications');

  // Create hamburger button
  const hamburger = await createHamburgerButton(hamburgerIcon);

  // Create navigation structure
  const topSection = document.createElement('div');
  topSection.classList.add('nav-top-section');

  const bottomSection = document.createElement('div');
  bottomSection.classList.add('nav-bottom-section');

  // Create top section layout
  const topLeft = document.createElement('div');
  topLeft.classList.add('nav-top-left');
  topLeft.append(hamburger);

  if (brandLogo) {
    const brandContainer = document.createElement('div');
    brandContainer.classList.add('nav-brand-logo');
    brandContainer.append(brandLogo);
    topLeft.append(brandContainer);
  }

  const topRight = document.createElement('div');
  topRight.classList.add('nav-top-right');
  if (toolsContent) topRight.append(toolsContent);
  if (navTools) topRight.append(navTools);

  topSection.append(topLeft, topRight);

  // Add navigation sections to bottom
  if (navSections) {
    bottomSection.append(navSections);
  }

  // Rebuild navigation structure
  nav.textContent = '';
  nav.append(topSection, bottomSection);

  // Create sidebar section if it exists
  let sidebarSection = null;
  if (sidebar) {
    sidebarSection = document.createElement('div');
    sidebarSection.classList.add('nav-sidebar');
    // Remove nav-tools class from sidebar
    sidebar.classList.remove('nav-tools');

    // Group sidebar content into header and main sections
    const columnsWrapper = sidebar.querySelector('.columns-wrapper');
    const accordionWrapper = sidebar.querySelector('.accordion-wrapper');

    if (columnsWrapper) {
      const headerSection = document.createElement('div');
      headerSection.classList.add('sidebar-header');
      headerSection.append(columnsWrapper);

      // Add close functionality to the first image in sidebar header
      const firstImage = columnsWrapper.querySelector('img');
      if (firstImage) {
        firstImage.classList.add('sidebar-close-button');
        firstImage.setAttribute('role', 'button');
        firstImage.setAttribute('tabindex', '0');
        firstImage.setAttribute('aria-label', 'Close sidebar');

        // Add click handler
        firstImage.addEventListener('click', () => {
          toggleSidebar(nav, sidebarSection, false);
        });

        // Add keyboard support
        firstImage.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSidebar(nav, sidebarSection, false);
          }
        });
      }

      sidebarSection.append(headerSection);
    }

    if (accordionWrapper) {
      const mainSection = document.createElement('div');
      mainSection.classList.add('sidebar-main');
      mainSection.append(accordionWrapper);
      sidebarSection.append(mainSection);
    }

    nav.append(sidebarSection);
  }

  // Add hamburger click event listener after sidebar section is created
  hamburger.addEventListener('click', () => toggleSidebar(nav, sidebarSection));

  // Initialize sidebar state and responsive behavior
  if (sidebarSection) {
    // Set initial display state
    if (isDesktop.matches) {
      sidebarSection.classList.add('sidebar-visible');
      sidebarSection.classList.remove('sidebar-hidden');
    } else {
      sidebarSection.classList.add('sidebar-hidden');
      sidebarSection.classList.remove('sidebar-visible');
    }

    // Add CSS classes for better styling control
    sidebarSection.classList.add('sidebar-initialized');

    await toggleSidebar(nav, sidebarSection, false);
    isDesktop.addEventListener('change', () => toggleSidebar(nav, sidebarSection, false));
  }

  // Handle mobile navigation visibility
  if (navSections) {
    if (isDesktop.matches) {
      navSections.classList.add('desktop-visible');
      navSections.classList.remove('mobile-visible');
    } else {
      navSections.classList.add('mobile-visible');
      navSections.classList.remove('desktop-visible');
    }
    isDesktop.addEventListener('change', () => {
      if (isDesktop.matches) {
        navSections.classList.add('desktop-visible');
        navSections.classList.remove('mobile-visible');
      } else {
        navSections.classList.add('mobile-visible');
        navSections.classList.remove('desktop-visible');
      }
    });
  }

  // Create navigation wrapper and add to block
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Process notifications block after navigation structure is built
  if (capturedNotificationsBlock) {
    processNotificationsBlock(capturedNotificationsBlock);
  }

  // Add breadcrumbs if enabled
  const breadcrumbsEnabled = getMetadata('breadcrumbs')?.toLowerCase() === 'true';
  if (breadcrumbsEnabled) {
    const breadcrumbs = await buildBreadcrumbs();
    navWrapper.append(breadcrumbs);
  }
}
