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

    const apiResponse = await response.json();

    // Apply sorting ONLY when saving to cache for articlesQueryIndex
    if (cacheKey === 'articlesQueryIndex' && apiResponse?.data) {
      apiResponse.data = apiResponse.data
        .filter((item) => item.path !== '/articles') // remove main listing
        .sort((a, b) => {
          const dateA = new Date(a.lastModified);
          const dateB = new Date(b.lastModified);
          return dateB - dateA; // newest first
        });
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
