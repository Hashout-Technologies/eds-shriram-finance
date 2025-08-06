import { FetchData } from '../../scripts/utils.js';
import { API_CONFIG, CACHE_CONFIG } from '../../scripts/constants.js';

/**
 * Gold Price Dropdown - Function-based implementation
 */
const goldPriceState = {
  cache: {
    data: null,
    timestamp: null,
    duration: CACHE_CONFIG.duration,
  },
  isLoading: false,
  dropdownElement: null,
  apiUrl: `${API_CONFIG.baseUrl}/dts-web/lending/api/v2/product/services`,
  signalId: API_CONFIG.signalId,
};

function formatPrice(priceInPaise) {
  const priceInRupees = parseFloat(priceInPaise) / 100;
  return priceInRupees.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function displayLoading() {
  const contentElement = document.getElementById('priceContent');
  if (!contentElement) return;

  contentElement.innerHTML = `
    <div class="loading">Loading rates...</div>
  `;
}

function displayError() {
  const contentElement = document.getElementById('priceContent');
  if (!contentElement) return;

  contentElement.innerHTML = `
    <div class="error">
      Unable to load current rates. Please try again later.
    </div>
  `;
}

function displayPrices(data) {
  const contentElement = document.getElementById('priceContent');
  if (!contentElement) return;

  const goldRate = formatPrice(data.GoldRate);
  const silverRate = formatPrice(data.SilverRate);
  const purity = data.Purity || '999';

  contentElement.innerHTML = `
    <div class="price-item">
      <div class="price-details">
        <div class="price-name">
          <span class="metal-name">Gold</span>
          <span class="separator">|</span>
          <span class="purity-info">24k (${purity} Purity)</span>
        </div>
        <div class="price-value">₹${goldRate}/g</div>
      </div>
    </div>
    <div class="price-item">
      <div class="price-details">
        <div class="price-name">
          <span class="metal-name">Silver</span>
          <span class="separator">|</span>
          <span class="purity-info">24k (${purity} Purity)</span>
        </div>
        <div class="price-value">₹${silverRate}/g</div>
      </div>
    </div>
  `;
}

function isCacheValid() {
  return goldPriceState.cache.data
         && goldPriceState.cache.timestamp
         && (Date.now() - goldPriceState.cache.timestamp) < goldPriceState.cache.duration;
}

function handleMouseLeave() {
  // Handle mouse leave if needed
}

async function handleMouseEnter() {
  // Display cached data if available, otherwise show error
  if (goldPriceState.cache.data) {
    displayPrices(goldPriceState.cache.data);
  } else if (!goldPriceState.isLoading) {
    displayError();
  }
}

async function loadPriceData() {
  if (isCacheValid()) {
    // Don't display here - only when user hovers
    return;
  }

  goldPriceState.isLoading = true;
  displayLoading();

  try {
    const result = await FetchData(
      goldPriceState.apiUrl,
      null, // No URL parameters
      { 'Content-Type': 'application/json' },
      JSON.stringify({ signal_id: goldPriceState.signalId }),
      'POST',
    );

    // Handle FetchData's error return (null)
    if (!result) {
      throw new Error('API request failed');
    }

    if (result.code === 200 && result.data) {
      goldPriceState.cache.data = result.data;
      goldPriceState.cache.timestamp = Date.now();
      // eslint-disable-next-line no-console
      console.log('Gold prices loaded and cached');
    } else {
      throw new Error(result.message || 'Invalid response format');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch gold prices:', error);
    // Keep cached data if available
  } finally {
    goldPriceState.isLoading = false;
  }
}

function attachEventListeners() {
  if (!goldPriceState.dropdownElement) return;

  goldPriceState.dropdownElement.addEventListener('mouseenter', handleMouseEnter);
  goldPriceState.dropdownElement.addEventListener('mouseleave', handleMouseLeave);
}

function createDropdownStructure() {
  const goldPriceElements = document.querySelectorAll('.nav-top-right p');
  let goldPriceElement = null;

  goldPriceElements.forEach((p) => {
    if (p.textContent.trim() === 'Gold Price') {
      goldPriceElement = p;
    }
  });

  if (!goldPriceElement) {
    // eslint-disable-next-line no-console
    console.warn('Gold Price element not found');
    return null;
  }

  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'gold-price-container';

  dropdownContainer.innerHTML = `
    <div class="gold-price-text">
      <span>Gold Price</span>
      <div class="gold-price-arrow"></div>
    </div>
    <div class="gold-price-dropdown">
      <div class="dropdown-content" id="priceContent">
        <div class="loading">Loading rates...</div>
      </div>
    </div>
  `;

  goldPriceElement.parentNode.replaceChild(dropdownContainer, goldPriceElement);
  goldPriceState.dropdownElement = dropdownContainer;

  return dropdownContainer;
}

function initGoldPriceDropdown() {
  const dropdownElement = createDropdownStructure();
  if (!dropdownElement) return null;

  attachEventListeners();
  // Call API immediately when dropdown is created
  loadPriceData();

  return {
    element: dropdownElement,
    loadData: loadPriceData,
    state: goldPriceState,
  };
}

// Default export function for header.js to use
export default function setupGoldPriceDropdown() {
  // Non-blocking initialization
  setTimeout(() => {
    try {
      const goldPriceDropdown = initGoldPriceDropdown();
      return goldPriceDropdown;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gold Price Dropdown failed:', error);
      return null;
    }
  }, 100);
}
