import { fetchWithCache } from '../../scripts/utils.js';
import { getApiDomain } from '../../scripts/config.js';
import { 
  GOLD_PRICE_API, 
  GOLD_PRICE_CACHE 
} from '../../scripts/constants.js';

/**
 * Gold Price Dropdown - Function-based implementation
 */
const goldPriceState = {
  isLoading: false,
  dropdownElement: null,
  apiUrl: null, 
  signalId: GOLD_PRICE_API.SIGNAL_ID,
  cacheKey: GOLD_PRICE_CACHE.STORAGE_KEY,
  cacheDuration: GOLD_PRICE_CACHE.DURATION_MINUTES,
};

/**
 * Initialize API URL using the simple domain config
 */
function initializeApiUrl() {
  const domain = getApiDomain();
  goldPriceState.apiUrl = `${domain}${GOLD_PRICE_API.ENDPOINT}`;

}

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



async function handleMouseEnter() {

  try {
    const cachedData = localStorage.getItem(goldPriceState.cacheKey);
    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      if (parsedCache.data && parsedCache.data.code === 200) {
        displayPrices(parsedCache.data.data);
        return;
      }
    }
  } catch (error) {
    console.warn('Error reading cached data on hover:', error);
  }

  // If no cached data and not currently loading, show loading state
  if (!goldPriceState.isLoading) {
    displayLoading();
  }
}

async function loadPriceData() {
  if (goldPriceState.isLoading) {
    return;
  }

  goldPriceState.isLoading = true;
  
  // Only show loading if we don't have any cached data to display
  try {
    const cachedData = localStorage.getItem(goldPriceState.cacheKey);
    if (!cachedData) {
      displayLoading();
    }
  } catch (error) {
    displayLoading();
  }

  try {
    // Initialize API URL if not already set
    if (!goldPriceState.apiUrl) {
      initializeApiUrl();
    }

    // Use fetchWithCache function with caching
    const result = await fetchWithCache(
      goldPriceState.apiUrl,
      goldPriceState.cacheKey,
      { signal_id: goldPriceState.signalId },
      { 'Content-Type': 'application/json' },
      goldPriceState.cacheDuration,
      'POST'
    );

    // Handle API response
    if (result && result.code === 200 && result.data) {
      displayPrices(result.data);
      console.log('Gold prices loaded successfully');
    } else {
      throw new Error(result?.message || 'Invalid response format');
    }
  } catch (error) {
    console.error('Failed to fetch gold prices:', error);
    displayError();
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
  // Initialize API URL based on environment
  initializeApiUrl();
  
  const dropdownElement = createDropdownStructure();
  if (!dropdownElement) return null;

  attachEventListeners();
  
  // Preload data immediately for better UX
  loadPriceData();

  return {
    element: dropdownElement,
    loadData: loadPriceData,
    state: goldPriceState,
  };
}

/**
 * Preload gold price data (can be called on page load for best UX)
 * @returns {Promise<void>}
 */
export function preloadGoldPriceData() {
  // Initialize API URL if not already set
  if (!goldPriceState.apiUrl) {
    initializeApiUrl();
  }
  
  // Load data in background
  return loadPriceData();
}

// Default export function for header.js to use
export default function setupGoldPriceDropdown() {
  // Non-blocking initialization
  setTimeout(() => {
    try {
      const goldPriceDropdown = initGoldPriceDropdown();
      return goldPriceDropdown;
    } catch (error) {
      console.error('Gold Price Dropdown failed:', error);
      return null;
    }
  }, 100);
}
