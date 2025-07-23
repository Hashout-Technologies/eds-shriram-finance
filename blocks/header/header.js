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
 * Handles keyboard navigation for dropdown menus
 */
function handleDropdownKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('nav-drop');

  if (!isNavDrop || (e.code !== 'Enter' && e.code !== 'Space')) return;

  e.preventDefault();
  const isExpanded = focused.getAttribute('aria-expanded') === 'true';

  toggleAllNavSections(focused.closest('.nav-sections'), false);
  focused.setAttribute('aria-expanded', !isExpanded);
}

/**
 * Adds keyboard event listener to focused nav section
 */
function enableKeyboardNavigation() {
  document.activeElement.addEventListener('keydown', handleDropdownKeydown);
}

/**
 * Manages dropdown keyboard accessibility based on screen size
 */
function handleDropdownAccessibility(navSections) {
  const navDrops = navSections.querySelectorAll('.nav-drop');

  navDrops.forEach((drop) => {
    if (isDesktop.matches) {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', enableKeyboardNavigation);
      }
    } else {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', enableKeyboardNavigation);
    }
  });
}

/**
 * Handles navigation closure when Escape key is pressed
 */
function handleEscapeKey(e) {
  if (e.code !== 'Escape') return;

  const nav = document.getElementById('nav');
  const navSections = nav.querySelector('.nav-sections');
  const expandedSection = navSections.querySelector('[aria-expanded="true"]');

  if (expandedSection && isDesktop.matches) {
    toggleAllNavSections(navSections, false);
    expandedSection.focus();
  } else if (!isDesktop.matches) {
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, navSections, false).then(() => {
      nav.querySelector('button').focus();
    });
  }
}

/**
 * Handles navigation closure when focus is lost
 */
function handleFocusLost(e) {
  const nav = e.currentTarget;

  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const expandedSection = navSections.querySelector('[aria-expanded="true"]');

    if (expandedSection && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
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
 * Toggles the mobile menu visibility and accessibility
 */
const toggleMenu = async (nav, navSections, forceExpanded = null) => {
  const isCurrentlyExpanded = nav.getAttribute('aria-expanded') === 'true';
  const shouldExpand = forceExpanded !== null ? forceExpanded : !isCurrentlyExpanded;

  const button = nav.querySelector('.nav-hamburger button');
  const placeholders = await fetchPlaceholders();

  // Update body overflow for mobile
  document.body.style.overflowY = !shouldExpand || isDesktop.matches ? '' : 'hidden';

  // Update nav state
  nav.setAttribute('aria-expanded', shouldExpand);
  toggleAllNavSections(navSections, shouldExpand && !isDesktop.matches);

  // Update button label
  const labelKey = shouldExpand ? 'navCloseLabel' : 'navOpenLabel';
  const defaultLabel = shouldExpand ? 'Close navigation' : 'Open navigation';
  button.setAttribute('aria-label', placeholders[labelKey] || defaultLabel);

  // Handle keyboard accessibility
  handleDropdownAccessibility(navSections);
  handleEventListeners(nav, shouldExpand);
};

/**
 * Hides all grandchildren (deeper nested levels) within a children container
 */
function hideGrandchildren(childrenContainer) {
  const grandchildren = childrenContainer.querySelectorAll('li > ul');
  grandchildren.forEach((grandchild) => {
    grandchild.style.display = 'none';
  });
}

/**
 * Shows all grandchildren (deeper nested levels) within a children container
 */
function showGrandchildren(childrenContainer) {
  const grandchildren = childrenContainer.querySelectorAll('li > ul');
  grandchildren.forEach((grandchild) => {
    grandchild.style.display = 'block';
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
  const visibleChildren = dropdownContainer.querySelectorAll("li > ul[style*='flex']");

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
    if (!submenuChildren) return;

    // Initially hide all submenu children and their grandchildren
    submenuChildren.style.display = 'none';
    hideGrandchildren(submenuChildren);

    // Show first submenu's children by default
    if (submenuItem === submenuItems[0]) {
      submenuChildren.style.display = 'flex';
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
          children.style.display = 'none';
          hideGrandchildren(children);
        }
        item.classList.remove('active');
      });

      // Show children and grandchildren of current submenu item
      submenuChildren.style.display = 'flex';
      showGrandchildren(submenuChildren);
      submenuItem.classList.add('active');

      // Update dropdown height based on new content
      updateDropdownHeight(mainDropdown);

      // Add smooth transition effect
      submenuChildren.style.opacity = '0';
      submenuChildren.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        submenuChildren.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        submenuChildren.style.opacity = '1';
        submenuChildren.style.transform = 'translateY(0)';
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
 * Sets up navigation tools section
 */
function setupNavTools(navTools) {
  if (!navTools) return;

  const searchLink = navTools.querySelector('a[href*="search"]');
  if (searchLink && !searchLink.textContent.trim()) {
    searchLink.setAttribute('aria-label', 'Search');
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

  // Extract navigation assets and create structure
  const { hamburgerIcon, brandLogo, toolsContent } = extractNavigationAssets(navBrand);

  // Create hamburger button
  const hamburger = await createHamburgerButton(hamburgerIcon);
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

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

  // Initialize menu state and responsive behavior
  await toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  // Create navigation wrapper and add to block
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  // Add breadcrumbs if enabled
  const breadcrumbsEnabled = getMetadata('breadcrumbs')?.toLowerCase() === 'true';
  if (breadcrumbsEnabled) {
    const breadcrumbs = await buildBreadcrumbs();
    navWrapper.append(breadcrumbs);
  }
}
