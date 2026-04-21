/**
 * ViewCounter Client Component
 * Client-side component for tracking and displaying blog post views
 * 
 * This is a vanilla JS/TS component that can be hydrated with client:load
 */

import { trackView, getViewCount } from '../../scripts/viewCounter';

export interface ViewCounterProps {
  slug: string;
  apiUrl: string;
  showCount?: boolean;
}

/**
 * ViewCounter class
 * Handles view tracking and display for a single blog post
 */
export class ViewCounter {
  private slug: string;
  private apiUrl: string;
  private showCount: boolean;
  private element: HTMLElement;

  constructor(element: HTMLElement, props: ViewCounterProps) {
    this.element = element;
    this.slug = props.slug;
    this.apiUrl = props.apiUrl;
    this.showCount = props.showCount ?? true;

    this.init();
  }

  /**
   * Initialize the view counter
   * Tracks the view and fetches the count
   */
  private async init(): Promise<void> {
    // Track the view (fire and forget)
    trackView(this.slug, this.apiUrl);

    // Fetch and display the count if enabled
    if (this.showCount) {
      await this.updateCount();
    }
  }

  /**
   * Fetch and update the view count display
   */
  private async updateCount(): Promise<void> {
    const count = await getViewCount(this.slug, this.apiUrl);

    if (count !== null) {
      const countElement = this.element.querySelector('.view-count-number');
      if (countElement) {
        countElement.textContent = count.toLocaleString();
      }
    }
  }
}

/**
 * Initialize all view counters on the page
 * This function is called when the component is hydrated
 */
export function initViewCounters(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-view-counter]');

  counters.forEach((element) => {
    const slug = element.getAttribute('data-slug');
    const apiUrl = element.getAttribute('data-api-url');
    const showCount = element.getAttribute('data-show-count') !== 'false';

    if (!slug || !apiUrl) {
      return;
    }

    new ViewCounter(element, { slug, apiUrl, showCount });
  });
}

// Auto-initialize if this script is loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewCounters);
  } else {
    initViewCounters();
  }
}
