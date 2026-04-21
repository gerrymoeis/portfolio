/**
 * View Counter Script
 * Handles tracking and displaying blog post view counts
 * 
 * Features:
 * - Tracks views by sending POST requests to external API
 * - Fetches and displays current view counts
 * - Graceful error handling (fails silently)
 * - Non-blocking to page content
 */

/**
 * Track a view for a blog post
 * Sends a POST request to increment the view counter
 * Fails silently on errors to avoid blocking page functionality
 * 
 * @param slug - The blog post slug
 * @param apiUrl - The base API URL from environment variables
 */
export async function trackView(slug: string, apiUrl: string): Promise<void> {
  try {
    // Don't track if no API URL is configured
    if (!apiUrl) {
      return;
    }

    const endpoint = `${apiUrl}/${slug}`;
    
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Success - no need to do anything
  } catch (error) {
    // Fail silently - don't break the page
    if (import.meta.env.DEV) {
      console.warn('Failed to track view:', error);
    }
  }
}

/**
 * Get the current view count for a blog post
 * Fetches the view count from the external API
 * Returns null on errors to allow graceful degradation
 * 
 * @param slug - The blog post slug
 * @param apiUrl - The base API URL from environment variables
 * @returns The view count or null if unavailable
 */
export async function getViewCount(slug: string, apiUrl: string): Promise<number | null> {
  try {
    // Don't fetch if no API URL is configured
    if (!apiUrl) {
      return null;
    }

    const endpoint = `${apiUrl}/${slug}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (import.meta.env.DEV) {
        console.warn('Failed to fetch view count:', response.status);
      }
      return null;
    }
    
    const data = await response.json();
    
    // Validate that we got a number back
    if (typeof data.count === 'number') {
      return data.count;
    }
    
    if (import.meta.env.DEV) {
      console.warn('Invalid view count response format');
    }
    return null;
  } catch (error) {
    // Fail silently - don't break the page
    if (import.meta.env.DEV) {
      console.warn('Failed to fetch view count:', error);
    }
    return null;
  }
}
