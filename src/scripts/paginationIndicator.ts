class PaginationIndicatorHandler {
  private container: HTMLElement;
  private dots: NodeListOf<HTMLButtonElement>;
  private currentIndex: number = 0;
  private totalPlaylists: number;

  constructor(container: HTMLElement) {
    this.container = container;
    this.dots = container.querySelectorAll('[data-carousel-dot]');
    this.totalPlaylists = parseInt(container.dataset.totalPlaylists || '0', 10);
    this.init();
  }

  private init() {
    this.setupEventListeners();
    this.updateAccessibility();
  }

  private setupEventListeners() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        this.handleDotClick(index);
      });

      dot.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.handleDotClick(index);
        }
      });
    });

    document.addEventListener('carousel:navigate', (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.carouselId === this.getCarouselId()) {
        this.updateActiveState(customEvent.detail.index);
      }
    });
  }

  private handleDotClick(index: number) {
    if (index === this.currentIndex || index < 0 || index >= this.totalPlaylists) {
      return;
    }

    const stopEvent = new CustomEvent('pagination:navigate', {
      detail: {
        index,
        fromIndex: this.currentIndex,
        toIndex: index
      },
      bubbles: true
    });
    document.dispatchEvent(stopEvent);

    this.currentIndex = index;
    this.updateActiveState(index);

    const navigationEvent = new CustomEvent('pagination:navigate', {
      detail: { index },
      bubbles: true
    });
    this.container.dispatchEvent(navigationEvent);
  }

  private updateActiveState(index: number) {
    this.currentIndex = index;

    this.dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle('pagination-dot--active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');

      const srText = dot.querySelector('.sr-only');
      if (srText) {
        const playlistTitle = dot.dataset.playlistTitle || `Playlist ${dotIndex + 1}`;
        srText.textContent = isActive ? `Current playlist: ${playlistTitle}` : playlistTitle;
      }
    });

    this.updateAccessibility();
  }

  private updateAccessibility() {
    this.dots.forEach((dot, index) => {
      const playlistTitle = dot.dataset.playlistTitle || `Playlist ${index + 1}`;
      const isActive = index === this.currentIndex;
      const label = `${isActive ? 'Current playlist: ' : 'Go to playlist '}${index + 1} of ${this.totalPlaylists}: ${playlistTitle}`;
      dot.setAttribute('aria-label', label);
    });
  }

  private getCarouselId(): string {
    const carousel = this.container.closest('[data-carousel-id]');
    return carousel?.getAttribute('data-carousel-id') || 'default';
  }

  public updateState(index: number) {
    if (index >= 0 && index < this.totalPlaylists) {
      this.updateActiveState(index);
    }
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }
}

export function initPaginationIndicators(): void {
  const indicators = document.querySelectorAll<HTMLElement>('[data-pagination-indicator]');
  indicators.forEach(indicator => {
    const handler = new PaginationIndicatorHandler(indicator);
    (indicator as any).paginationHandler = handler;
  });
}

export { PaginationIndicatorHandler };

if (typeof window !== 'undefined') {
  (window as any).PaginationIndicatorHandler = PaginationIndicatorHandler;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPaginationIndicators);
} else {
  initPaginationIndicators();
}
