class NavigationControlsHandler {
  private container: HTMLElement;
  private buttons: NodeListOf<HTMLButtonElement>;

  constructor(container: HTMLElement) {
    this.container = container;
    this.buttons = container.querySelectorAll('.nav-button');
    this.init();
  }

  private init() {
    this.setupKeyboardHandlers();
    this.setupButtonHandlers();
  }

  private setupKeyboardHandlers() {
    this.container.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  private setupButtonHandlers() {
    this.buttons.forEach(button => {
      button.addEventListener('click', this.handleButtonClick.bind(this));
      button.addEventListener('keydown', this.handleButtonKeydown.bind(this));
    });
  }

  private handleKeydown(event: KeyboardEvent) {
    if (!this.container.contains(event.target as Node)) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.triggerNavigation('previous');
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.triggerNavigation('next');
        break;
    }
  }

  private handleButtonKeydown(event: KeyboardEvent) {
    const button = event.currentTarget as HTMLButtonElement;
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!button.disabled) {
          button.click();
        }
        break;
    }
  }

  private handleButtonClick(event: Event) {
    const button = event.currentTarget as HTMLButtonElement;
    const direction = button.dataset.carouselNav as 'previous' | 'next';
    if (!button.disabled) {
      this.triggerNavigation(direction);
    }
  }

  private triggerNavigation(direction: 'previous' | 'next') {
    const navigationEvent = new CustomEvent('carousel:navigate', {
      detail: { direction },
      bubbles: true
    });
    document.dispatchEvent(navigationEvent);
    this.container.dispatchEvent(navigationEvent);
  }

  public updateButtonStates(currentIndex: number, totalPlaylists: number) {
    const prevButton = this.container.querySelector('[data-carousel-nav="previous"]') as HTMLButtonElement;
    const nextButton = this.container.querySelector('[data-carousel-nav="next"]') as HTMLButtonElement;

    if (prevButton) {
      prevButton.disabled = currentIndex === 0;
      prevButton.setAttribute('aria-label',
        currentIndex === 0
          ? 'Previous playlist (unavailable)'
          : `Previous playlist (${currentIndex} of ${totalPlaylists})`
      );
    }

    if (nextButton) {
      nextButton.disabled = currentIndex === totalPlaylists - 1;
      nextButton.setAttribute('aria-label',
        currentIndex === totalPlaylists - 1
          ? 'Next playlist (unavailable)'
          : `Next playlist (${currentIndex + 2} of ${totalPlaylists})`
      );
    }
  }
}

export function initNavigationControls(): void {
  const containers = document.querySelectorAll<HTMLElement>('.navigation-controls');
  containers.forEach(container => {
    const handler = new NavigationControlsHandler(container);
    (container as any).navigationHandler = handler;
  });
}

export { NavigationControlsHandler };

if (typeof window !== 'undefined') {
  (window as any).NavigationControlsHandler = NavigationControlsHandler;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigationControls);
} else {
  initNavigationControls();
}
