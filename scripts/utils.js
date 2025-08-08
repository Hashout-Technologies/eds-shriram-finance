export default function scrollElementToTopAfterOpen(element) {
  requestAnimationFrame(() => {
    setTimeout(() => {
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth',
      });
    }, 50);
  });
}

export function CreateElem(type, className, id, text) {
  const elem = document.createElement(type);
  if (className) elem.className = className;
  if (id) elem.id = id;
  if (text) elem.textContent = text;
  return elem;
}

function applyArticlesFilterAndSort(apiResponse) {
  if (!apiResponse?.data) return apiResponse;

  const currentPath = window.location.pathname;
  const parts = currentPath.split('/').filter(Boolean);

  let filtered = apiResponse.data.filter((item) => {
    const itemParts = item.path.split('/').filter(Boolean);

    // Exclude /articles
    if (item.path === '/articles') return false;

    // Exclude /articles/{category}
    if (itemParts.length === 2) return false;

    // Exclude /articles/{category}/{year}
    if (itemParts.length === 3 && /^\d{4}$/.test(itemParts[2])) return false;

    return true;
  });

  // Category-specific filtering
  if (parts.length === 2 && parts[0] === 'articles') {
    const category = parts[1];
    filtered = filtered.filter((item) => item.path.startsWith(`/articles/${category}/`));
  }

  // Sort by lastModified (recent first)
  filtered.sort((a, b) => {
    const dateA = new Date(a.lastModified || 0);
    const dateB = new Date(b.lastModified || 0);
    return dateB - dateA;
  });

  return { ...apiResponse, data: filtered };
}

export async function fetchWithCache(url, cacheKey, body, headers, cacheDurationMinutes = 60, method = 'POST') {
  try {
    // Check localStorage for cached data
    const cachedData = localStorage.getItem(cacheKey);
    const currentTime = Date.now();
    const cacheDurationMs = cacheDurationMinutes * 60 * 1000; // Convert minutes to milliseconds

    if (cachedData) {
      try {
        const parsedCache = JSON.parse(cachedData);

        // Check if cached data is still valid
        if (parsedCache.storedTime
            && parsedCache.data
            && (currentTime - parsedCache.storedTime) < cacheDurationMs) {
          return parsedCache.data;
        }
      } catch (parseError) {
        console.warn('Error parsing cached data, fetching fresh data:', parseError);
        // Remove corrupted data
        localStorage.removeItem(cacheKey);
      }
    }

    // Stringify body if it's an object
    const requestBody = typeof body === 'object' && body !== null
      ? JSON.stringify(body)
      : body;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      method,
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let apiResponse = await response.json();

    // 4️⃣ Apply filtering/sorting **only when first saving**
    if (cacheKey === 'articlesQueryIndex') {
      apiResponse = applyArticlesFilterAndSort(apiResponse);
    }

    // Create storage object with timestamp
    const cacheObject = {
      storedTime: currentTime,
      data: apiResponse,
    };

    // Store in localStorage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
    } catch (storageError) {
      console.warn('Failed to store data in localStorage:', storageError);
    }

    return cacheObject.data;
  } catch (error) {
    console.error('fetchWithCache error:', error);
    throw error;
  }
}

export async function FetchData(url, params, headers, body, method = 'GET') {
  let finalUrl = url;

  // Add query parameters if provided
  if (params) {
    const searchParams = new URLSearchParams(params);
    finalUrl += `?${searchParams.toString()}`;
  }

  try {
    // Stringify body if it's an object
    const requestBody = typeof body === 'object'
      ? JSON.stringify(body)
      : body;

    const response = await fetch(finalUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      method,
      body: requestBody,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('FetchData error:', error);
    return null;
  }
}
