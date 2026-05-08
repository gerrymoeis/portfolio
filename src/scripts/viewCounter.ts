/**
 * View Counter Script
 * Handles tracking and displaying blog post view counts
 * 
 * Features:
 * - Tracks views by sending POST requests to external API
 * - Fetches and displays current view counts
 * - Graceful error handling (fails silently)
 * - Non-blocking to page content
 * - Rate limit handling dengan exponential backoff
 * - Request validation
 * - localStorage-based duplicate prevention (7-day window)
 */

/**
 * Validate slug format
 * Slug should be alphanumeric with hyphens, 1-100 characters
 * 
 * @param slug - The blog post slug to validate
 * @returns True if slug is valid
 */
function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  if (slug.length < 1 || slug.length > 100) return false;
  
  // Alphanumeric with hyphens only
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * Check if view has been tracked recently
 * Uses localStorage to prevent duplicate counts within 7-day window
 * 
 * @param slug - The blog post slug
 * @returns True if view was already tracked recently
 */
function hasRecentView(slug: string): boolean {
  try {
    const key = `view-tracked-${slug}`;
    const lastView = localStorage.getItem(key);
    
    if (!lastView) return false;
    
    const lastViewTime = parseInt(lastView, 10);
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    // Check if last view was within 7 days
    return (now - lastViewTime) < sevenDays;
  } catch {
    // If localStorage is not available, allow tracking
    return false;
  }
}

/**
 * Mark view as tracked
 * Stores timestamp in localStorage
 * 
 * @param slug - The blog post slug
 */
function markViewTracked(slug: string): void {
  try {
    const key = `view-tracked-${slug}`;
    localStorage.setItem(key, Date.now().toString());
  } catch {
    // Fail silently if localStorage is not available
  }
}

/**
 * Track a view for a blog post
 * Sends a POST request to increment the view counter
 * Implements retry logic dengan exponential backoff for 429 responses
 * Fails silently on errors to avoid blocking page functionality
 * Uses localStorage to prevent duplicate tracking within 7 days
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
    
    // Validate slug format
    if (!isValidSlug(slug)) {
      if (import.meta.env.DEV) {
        console.warn('[ViewCounter] Invalid slug format:', slug);
      }
      return;
    }

    // Check if view was already tracked recently (7-day window)
    if (hasRecentView(slug)) {
      if (import.meta.env.DEV) {
        console.log('[ViewCounter] View already tracked recently, skipping');
      }
      return;
    }

    const endpoint = `${apiUrl}/${slug}`;
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Handle rate limiting
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter 
            ? parseInt(retryAfter) * 1000 
            : Math.pow(2, attempt) * 1000 + Math.random() * 1000; // Exponential backoff with jitter
          
          if (import.meta.env.DEV) {
            console.warn(`[ViewCounter] Rate limited, retrying after ${waitTime}ms`);
          }
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue; // Retry
        }
        
        // Success or non-retryable error
        if (response.ok) {
          // Mark view as tracked in localStorage
          markViewTracked(slug);
          
          if (import.meta.env.DEV) {
            console.log('[ViewCounter] View tracked successfully');
          }
        }
        break; // Don't retry on other status codes
        
      } catch (fetchError) {
        // Network error - retry with backoff
        if (attempt < maxRetries - 1) {
          const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        throw fetchError; // Throw on last attempt
      }
    }
    
  } catch (error) {
    // Fail silently - don't break the page
    if (import.meta.env.DEV) {
      console.warn('[ViewCounter] Failed to track view:', error);
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
    
    // Validate slug format
    if (!isValidSlug(slug)) {
      if (import.meta.env.DEV) {
        console.warn('[ViewCounter] Invalid slug format:', slug);
      }
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
        console.warn('[ViewCounter] Failed to fetch view count:', response.status);
      }
      return null;
    }
    
    const data = await response.json();
    
    // Validate that we got a number back
    if (typeof data.count === 'number' && data.count >= 0) {
      return data.count;
    }
    
    if (import.meta.env.DEV) {
      console.warn('[ViewCounter] Invalid view count response format');
    }
    return null;
  } catch (error) {
    // Fail silently - don't break the page
    if (import.meta.env.DEV) {
      console.warn('[ViewCounter] Failed to fetch view count:', error);
    }
    return null;
  }
}
