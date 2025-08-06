/**
 * Scroll the element to top of page after it is opened or expanded.
 * @param {HTMLElement} element - The element to scroll into view.
 */
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
