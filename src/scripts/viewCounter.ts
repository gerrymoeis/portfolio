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
 * - Idempotency support
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
 * Get or create session ID for idempotency
 * Stored in localStorage to persist across page loads
 * 
 * @returns Session ID string
 */
function getSessionId(): string {
  const key = 'view-counter-session';
  let sessionId = localStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

/**
 * Generate idempotency key for view tracking
 * Prevents duplicate counts from retries or multiple tabs
 * Uses 5-minute time windows
 * 
 * @param slug - The blog post slug
 * @returns Idempotency key string
 */
function generateIdempotencyKey(slug: string): string {
  const sessionId = getSessionId();
  const timeWindow = Math.floor(Date.now() / (5 * 60 * 1000)); // 5-minute windows
  return `${slug}-${sessionId}-${timeWindow}`;
}

/**
 * Track a view for a blog post
 * Sends a POST request to increment the view counter
 * Implements retry logic dengan exponential backoff for 429 responses
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
    
    // Validate slug format
    if (!isValidSlug(slug)) {
      if (import.meta.env.DEV) {
        console.warn('[ViewCounter] Invalid slug format:', slug);
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
            'X-Idempotency-Key': generateIdempotencyKey(slug),
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
