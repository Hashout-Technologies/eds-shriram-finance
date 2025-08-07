const API_CONFIG = {
  baseUrl: 'https://uatapigw.shriramfinance.in',
  signalId: 3114,
};

/**
 * Gold Price Dropdown Class
 * Simple configurable base URL
 */
class GoldPriceDropdown {
  constructor() {
    this.apiUrl = `${API_CONFIG.baseUrl}/dts-web/lending/api/v2/product/services`;
    this.signalId = API_CONFIG.signalId;

    this.cache = {
      data: null,
      timestamp: null,
      duration: 60 * 60 * 1000, // 1 hour cache
    };
    this.isLoading = false;
    this.dropdownElement = null;
    this.init();
  }

  init() {
    this.createDropdownStructure();
    this.attachEventListeners();
    // Call API immediately when dropdown is created
    this.loadPriceData();
  }

  createDropdownStructure() {
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
      return;
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
    this.dropdownElement = dropdownContainer;
  }

  attachEventListeners() {
    if (!this.dropdownElement) return;

    this.dropdownElement.addEventListener('mouseenter', () => this.handleMouseEnter());
    this.dropdownElement.addEventListener('mouseleave', () => this.handleMouseLeave());
  }

  async handleMouseEnter() {
    // Display cached data if available, otherwise show error
    if (this.cache.data) {
      this.displayPrices(this.cache.data);
    } else if (!this.isLoading) {
      this.displayError();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleMouseLeave() {
    // Handle mouse leave if needed
  }

  async loadPriceData() {
    if (this.isCacheValid()) {
      this.displayPrices(this.cache.data);
      return;
    }

    this.isLoading = true;
    this.displayLoading();

    try {
      // eslint-disable-next-line no-console
      console.log(`Calling API: ${this.apiUrl}`);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signal_id: this.signalId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.code === 200 && result.data) {
        this.cache.data = result.data;
        this.cache.timestamp = Date.now();

        // Don't display immediately - only when user hovers
        // eslint-disable-next-line no-console
        console.log('Gold prices loaded and cached');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch gold prices:', error);
      // Keep loading state - will show error only when user hovers
    } finally {
      this.isLoading = false;
    }
  }

  isCacheValid() {
    return this.cache.data
           && this.cache.timestamp
           && (Date.now() - this.cache.timestamp) < this.cache.duration;
  }

  // eslint-disable-next-line class-methods-use-this
  displayLoading() {
    const contentElement = document.getElementById('priceContent');
    if (!contentElement) return;

    contentElement.innerHTML = `
      <div class="loading">Loading rates...</div>
    `;
  }

  displayPrices(data) {
    const contentElement = document.getElementById('priceContent');
    if (!contentElement) return;

    const goldRate = this.formatPrice(data.GoldRate);
    const silverRate = this.formatPrice(data.SilverRate);
    const purity = data.Purity || '999';

    // Clean display with separated styling for name and purity
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

  // eslint-disable-next-line class-methods-use-this
  displayError() {
    const contentElement = document.getElementById('priceContent');
    if (!contentElement) return;

    contentElement.innerHTML = `
      <div class="error">
        Unable to load current rates. Please try again later.
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  formatPrice(priceInPaise) {
    const priceInRupees = parseFloat(priceInPaise) / 100;
    return priceInRupees.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

// Default export function for header.js to use
export default function setupGoldPriceDropdown() {
  // Non-blocking initialization
  setTimeout(() => {
    try {
      const goldPriceDropdown = new GoldPriceDropdown();
      return goldPriceDropdown;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Gold Price Dropdown failed:', error);
      return null;
    }
  }, 100);
}
