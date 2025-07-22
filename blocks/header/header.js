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
 * Determines if a dropdown has mixed content (some items with children, some without)
 */
function hasMixedContent(dropdown) {
  const submenuItems = dropdown.querySelectorAll(':scope > li');
  let hasItemsWithChildren = false;
  let hasItemsWithoutChildren = false;

  submenuItems.forEach((item) => {
    const hasChildren = item.querySelector(':scope > ul') !== null;
    if (hasChildren) {
      hasItemsWithChildren = true;
    } else {
      hasItemsWithoutChildren = true;
    }
  });

  return hasItemsWithChildren && hasItemsWithoutChildren;
}

/**
 * Updates the dropdown height dynamically based on content
 */
function updateDropdownHeight(mainDropdown) {
  const dropdownContainer = mainDropdown.closest('ul');
  if (!dropdownContainer) return;

  const hasMixed = hasMixedContent(dropdownContainer);
  let maxHeight = 0;

  // Get all visible submenu children containers
  const visibleChildren = dropdownContainer.querySelectorAll(
    'li > ul.submenu-children-visible',
  );

  visibleChildren.forEach((childrenContainer) => {
    const contentHeight = childrenContainer.scrollHeight;
    maxHeight = Math.max(maxHeight, contentHeight);
  });

  // For mixed content scenarios, ensure we have enough height for the submenu items
  if (hasMixed && visibleChildren.length === 0) {
    const submenuItems = dropdownContainer.querySelectorAll(':scope > li');
    const itemHeight = 48; // Approximate height per submenu item
    maxHeight = submenuItems.length * itemHeight;
  }

  // Add padding and minimum height considerations
  const padding = 24;
  const minHeight = hasMixed ? 240 : 200;
  const calculatedHeight = Math.max(maxHeight + padding, minHeight);

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
 * Handles leaf node click functionality
 */
function setupLeafNodeClick(submenuParagraph, submenuItem) {
  // Check if paragraph contains an anchor
  const anchor = submenuParagraph.querySelector('a');
  if (anchor) {
    submenuParagraph.addEventListener('click', (e) => {
      e.preventDefault();
      anchor.click();
    });
    return;
  }

  // Look for URL in various possible locations
  let url = submenuParagraph.getAttribute('data-url')
            || submenuItem.getAttribute('data-url')
            || submenuItem.querySelector(':scope > a')?.href;

  if (!url) {
    // Generate fallback URL based on text content
    const paragraphText = submenuParagraph.textContent.trim();
    url = `/${paragraphText.toLowerCase().replace(/\s+/g, '-')}`;
  }

  // Make paragraph clickable
  submenuParagraph.style.cursor = 'pointer';
  submenuParagraph.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = url;
  });

  // Add hover effects
  submenuParagraph.addEventListener('mouseenter', () => {
    submenuParagraph.style.color = '#1a1a1a';
  });

  submenuParagraph.addEventListener('mouseleave', () => {
    submenuParagraph.style.color = '';
  });
}

/**
 * Sets up hover events for submenu items to show only their children
 */
function setupSubmenuHoverEvents(navSection) {
  const mainDropdown = navSection.querySelector('ul');
  if (!mainDropdown) return;

  const submenuItems = mainDropdown.querySelectorAll(':scope > li');
  const hasMixed = hasMixedContent(mainDropdown);

  if (hasMixed) {
    mainDropdown.classList.add('nav-mixed-content');
  }

  submenuItems.forEach((submenuItem) => {
    const submenuChildren = submenuItem.querySelector(':scope > ul');

    // Handle leaf nodes (items without children)
    if (!submenuChildren) {
      submenuItem.classList.add('nav-leaf');

      const directAnchor = submenuItem.querySelector(':scope > a');
      if (directAnchor) return; // Styling handled by CSS

      const submenuParagraph = submenuItem.querySelector(':scope > p');
      if (submenuParagraph) {
        setupLeafNodeClick(submenuParagraph, submenuItem);
      }
      return;
    }

    // Handle items with children
    const hasGrandchildren = submenuChildren.querySelectorAll('li > ul').length > 0;

    if (hasGrandchildren) {
      // Initially hide all submenu children and their grandchildren
      submenuChildren.classList.remove('submenu-children-visible');
      submenuChildren.classList.add('submenu-children-hidden');
      hideGrandchildren(submenuChildren);

      // Show first submenu's children by default
      if (submenuItem === submenuItems[0]) {
        submenuChildren.classList.remove('submenu-children-hidden');
        submenuChildren.classList.add('submenu-children-visible', 'submenu-visible');
        showGrandchildren(submenuChildren);
        submenuItem.classList.add('active');
        updateDropdownHeight(mainDropdown);
      }
    } else {
      // Direct children - show them immediately
      submenuChildren.classList.remove('submenu-children-hidden');
      submenuChildren.classList.add('submenu-children-visible', 'submenu-visible');

      if (submenuItem === submenuItems[0]) {
        submenuItem.classList.add('active');
        updateDropdownHeight(mainDropdown);
      }
    }

    // Handle first item being a leaf node
    if (submenuItem === submenuItems[0] && !submenuChildren) {
      const firstItemWithChildren = Array.from(submenuItems).find(
        (item) => item.querySelector(':scope > ul') && !item.classList.contains('nav-leaf'),
      );

      if (firstItemWithChildren && firstItemWithChildren !== submenuItem) {
        const firstItemChildren = firstItemWithChildren.querySelector(':scope > ul');
        if (firstItemChildren) {
          firstItemChildren.classList.remove('submenu-children-hidden');
          firstItemChildren.classList.add('submenu-children-visible', 'submenu-visible');
          showGrandchildren(firstItemChildren);
          firstItemWithChildren.classList.add('active');
          updateDropdownHeight(mainDropdown);
        }
      }
    }

    // Add hover events
    submenuItem.addEventListener('mouseenter', () => {
      // Hide all submenu children first
      submenuItems.forEach((item) => {
        const children = item.querySelector(':scope > ul');
        if (children) {
          children.classList.remove('submenu-children-visible');
          children.classList.add('submenu-children-hidden');
          hideGrandchildren(children);
        }
        if (!item.classList.contains('nav-leaf')) {
          item.classList.remove('active');
        }
      });

      const containsGrandchildren = submenuChildren.querySelectorAll('li > ul').length > 0;

      if (containsGrandchildren) {
        submenuChildren.classList.remove('submenu-children-hidden');
        submenuChildren.classList.add('submenu-children-visible');
        showGrandchildren(submenuChildren);
        submenuItem.classList.add('active');
        updateDropdownHeight(mainDropdown);

        // Add smooth transition effect
        submenuChildren.classList.add('submenu-transition');
        submenuChildren.classList.remove('submenu-visible');
        setTimeout(() => {
          submenuChildren.classList.add('submenu-visible');
        }, 10);
      } else {
        submenuChildren.classList.remove('submenu-children-hidden');
        submenuChildren.classList.add('submenu-children-visible', 'submenu-visible');
        submenuItem.classList.add('active');
        updateDropdownHeight(mainDropdown);
      }
    });
  });
}

/**
 * Sets up desktop hover events for dropdown menus
 */
function setupDesktopDropdownEvents(navSection, navSections) {
  let hoverTimeout;

  navSection.addEventListener('mouseenter', () => {
    clearTimeout(hoverTimeout);
    toggleAllNavSections(navSections, false);
    navSection.setAttribute('aria-expanded', 'true');
    setupSubmenuHoverEvents(navSection);
  });

  navSection.addEventListener('mouseleave', () => {
    hoverTimeout = setTimeout(() => {
      navSection.setAttribute('aria-expanded', 'false');
      resetDropdownHeight(navSection);
    }, 150);
  });

  const dropdown = navSection.querySelector('ul');
  if (dropdown) {
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
    });

    dropdown.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => {
        navSection.setAttribute('aria-expanded', 'false');
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
  let brandLink = null;
  let toolsContent = null;

  const firstColumn = columnsBlock.querySelector('div > div:first-child');
  if (firstColumn) {
    const images = firstColumn.querySelectorAll('picture');
    if (images.length >= 2) {
      hamburgerIcon = images[0].cloneNode(true);
      brandLogo = images[1].cloneNode(true);
    }

    // Extract the brand link
    const link = firstColumn.querySelector('a[href*="fast.com"]');
    if (link) {
      brandLink = link.cloneNode(true);
    }
  }

  const secondColumn = columnsBlock.querySelector('div > div:last-child');
  const toolsDiv = secondColumn?.querySelector('div:last-child');
  if (toolsDiv) {
    toolsContent = toolsDiv.cloneNode(true);
  }

  return {
    hamburgerIcon, brandLogo, brandLink, toolsContent,
  };
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
 * Initializes mixed content classes for all dropdowns
 */
function initializeMixedContentClasses(navSections) {
  const dropdowns = navSections.querySelectorAll(
    ':scope .default-content-wrapper > ul > li > ul',
  );

  dropdowns.forEach((dropdown) => {
    const hasMixed = hasMixedContent(dropdown);
    if (hasMixed) {
      dropdown.classList.add('nav-mixed-content');
    }
  });
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

    if (isDesktop.matches) {
      setupDesktopDropdownEvents(navSection, navSections);
    } else {
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

  const isCurrentlyVisible = !notificationsBlock.classList.contains('notifications-block-hidden')
    && !container.classList.contains('notifications-hidden');
  const shouldShow = forceVisible !== null ? forceVisible : !isCurrentlyVisible;

  if (shouldShow) {
    notificationsBlock.classList.remove('notifications-block-hidden');
    notificationsBlock.classList.add('notifications-block-visible');
    container.classList.remove('notifications-hidden');
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
  const notificationIcons = document.querySelectorAll(
    '.icon-notification, [data-icon="notification"], .notification-icon',
  );
  let clickedOutside = true;

  notificationIcons.forEach((icon) => {
    if (icon.contains(e.target)) {
      clickedOutside = false;
    }
  });

  if (clickedOutside) {
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
  const existingBadge = notificationIcon.querySelector('.notification-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

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
  const notificationsBlock = notificationIcon.querySelector('.notifications')
    || document.querySelector('.notifications');
  if (!notificationsBlock) return;

  const notificationItems = notificationsBlock.querySelectorAll('.notification-item');
  const count = notificationItems.length;

  createNotificationBadge(notificationIcon, count);
}

/**
 * Sets up notification icon click functionality
 */
function setupNotificationIcon(notificationIcon) {
  const notificationsBlock = notificationIcon.querySelector('.notifications')
    || document.querySelector('.notifications');

  if (!notificationsBlock) {
    if (!window.pendingNotificationIcons) {
      window.pendingNotificationIcons = [];
    }
    window.pendingNotificationIcons.push(notificationIcon);
    return;
  }

  updateNotificationBadge(notificationIcon);

  notificationIcon.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNotifications(notificationsBlock);
  });

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
  const notificationIcons = document.querySelectorAll(
    '.icon-notification, [data-icon="notification"], .notification-icon',
  );

  if (notificationIcons.length > 0) {
    const firstIcon = notificationIcons[0];
    firstIcon.appendChild(notificationsBlock);
  } else {
    document.body.appendChild(notificationsBlock);
  }

  const closeButton = notificationsBlock.querySelector('.notifications-close');
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleNotifications(notificationsBlock, false);
    });
  }

  notificationsBlock.classList.add('notifications-block-hidden');
  const container = notificationsBlock.querySelector('.notifications-container');
  if (container) {
    container.classList.add('notifications-hidden');
  }

  notificationIcons.forEach((icon) => {
    updateNotificationBadge(icon);
  });

  if (window.pendingNotificationIcons?.length > 0) {
    window.pendingNotificationIcons.forEach((icon) => {
      setupNotificationIcon(icon);
    });
    window.pendingNotificationIcons = [];
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

  const notificationIcon = navTools.querySelector(
    '.icon-notification, [data-icon="notification"], .notification-icon',
  );

  if (notificationIcon) {
    setupNotificationIcon(notificationIcon);
  }
}

/**
 * Creates sidebar header with close button and brand logo
 */
function createSidebarHeader(brandLogo) {
  const headerSection = document.createElement('div');
  headerSection.classList.add('sidebar-header');

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.classList.add('sidebar-close-button');
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('aria-label', 'Close sidebar');
  closeButton.setAttribute('tabindex', '0');

  const closeIcon = document.createElement('img');
  closeIcon.src = '/icons/close.svg';
  closeIcon.alt = 'Close';
  closeIcon.setAttribute('aria-hidden', 'true');
  closeButton.appendChild(closeIcon);

  // Create brand logo container
  const brandLogoContainer = document.createElement('div');
  brandLogoContainer.classList.add('sidebar-brand-logo');

  if (brandLogo) {
    const clonedBrandLogo = brandLogo.cloneNode(true);
    brandLogoContainer.appendChild(clonedBrandLogo);
  }

  headerSection.appendChild(closeButton);
  headerSection.appendChild(brandLogoContainer);

  return { headerSection, closeButton };
}

/**
 * Creates sidebar main section
 */
function createSidebarMain(sidebar) {
  const mainSection = document.createElement('div');
  mainSection.classList.add('sidebar-main');

  const accordionWrapper = sidebar.querySelector('.accordion-wrapper');
  const textWrapper = sidebar.querySelector('.text-wrapper');

  if (accordionWrapper) {
    mainSection.append(accordionWrapper);
  }

  if (textWrapper) {
    mainSection.append(textWrapper);
  }

  // Add any other content
  const otherContent = sidebar.querySelectorAll(':scope > *');
  otherContent.forEach((content) => {
    if (
      !mainSection.contains(content)
      && content !== accordionWrapper
      && content !== textWrapper
      && !content.classList.contains('sidebar-header')
    ) {
      mainSection.append(content);
    }
  });

  return mainSection;
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
    // Find the brand link - look for the link with fast.com URL
    const brandLink = navBrand.querySelector('a[href*="fast.com"]');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container')?.classList.remove('button-container');
    }
  }

  // Setup navigation sections
  if (navSections) {
    setupNavSectionListeners(navSections);
    cleanupButtonStyling(navSections);
    initializeMixedContentClasses(navSections);
  }

  // Setup navigation tools
  setupNavTools(navTools);

  // Remove sidebar from navTools if it exists
  if (navTools && sidebar) {
    sidebar.remove();
  }

  // Extract navigation assets and create structure
  const {
    hamburgerIcon, brandLogo, brandLink, toolsContent,
  } = extractNavigationAssets(navBrand);

  // Setup notification icon from toolsContent
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

    // If we have a brandLink, wrap the logo with it
    if (brandLink) {
      brandLink.textContent = ''; // Clear any text content
      brandLink.appendChild(brandLogo);
      brandContainer.append(brandLink);
    } else {
      brandContainer.append(brandLogo);
    }

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
    sidebar.classList.remove('nav-tools');

    // Create sidebar header
    const { headerSection, closeButton } = createSidebarHeader(brandLogo);
    sidebarSection.append(headerSection);

    // Create sidebar main section
    const mainSection = createSidebarMain(sidebar);
    if (mainSection.children.length > 0) {
      sidebarSection.append(mainSection);
    }

    nav.append(sidebarSection);

    // Add close button event listeners
    closeButton.addEventListener('click', () => {
      toggleSidebar(nav, sidebarSection, false);
    });

    closeButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSidebar(nav, sidebarSection, false);
      }
    });
  }

  // Add hamburger click event listener
  hamburger.addEventListener('click', () => toggleSidebar(nav, sidebarSection));

  // Initialize sidebar state and responsive behavior
  if (sidebarSection) {
    if (isDesktop.matches) {
      sidebarSection.classList.add('sidebar-visible');
      sidebarSection.classList.remove('sidebar-hidden');
    } else {
      sidebarSection.classList.add('sidebar-hidden');
      sidebarSection.classList.remove('sidebar-visible');
    }

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
