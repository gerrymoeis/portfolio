class SoundCloudPlaylistCarousel {
  private container: HTMLElement;
  private liveRegion: HTMLElement;
  private currentIndex: number = 0;
  private totalPlaylists: number;
  private playlists: any[];
  private embeds: NodeListOf<HTMLElement>;
  private lazyLoad: boolean;
  private observer: IntersectionObserver | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.liveRegion = container.querySelector('.carousel-live-region') as HTMLElement;
    this.totalPlaylists = parseInt(container.dataset.totalPlaylists || '0', 10);
    this.playlists = JSON.parse(container.dataset.playlists || '[]');
    this.embeds = container.querySelectorAll('.carousel-embed');
    this.lazyLoad = container.dataset.lazyLoad === 'true';
    this.init();
  }

  private init() {
    if (this.lazyLoad) {
      this.setupLazyLoading();
    }
    if (this.totalPlaylists <= 1) return;
    this.setupEventListeners();
    this.updateAccessibility();
  }

  private setupLazyLoading() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadVisibleEmbeds();
            if (this.observer) {
              this.observer.disconnect();
            }
          }
        });
      },
      { rootMargin: '100px', threshold: 0.1 }
    );
    this.observer.observe(this.container);

    const placeholders = this.container.querySelectorAll('.soundcloud-placeholder');
    placeholders.forEach((placeholder, index) => {
      placeholder.addEventListener('click', () => {
        this.loadEmbed(index);
      });
    });
  }

  private loadVisibleEmbeds() {
    this.loadEmbed(this.currentIndex);
  }

  private loadEmbed(index: number) {
    const embed = this.embeds[index];
    if (!embed) return;

    if (embed.dataset.loaded === 'true') return;

    const placeholder = embed.querySelector('.soundcloud-placeholder');
    if (!placeholder) return;

    placeholder.classList.add('loading');

    const embedUrl = embed.dataset.embedUrl;
    const embedTitle = embed.dataset.embedTitle;
    if (!embedUrl) return;

    const iframe = document.createElement('iframe');
    iframe.className = 'soundcloud-iframe';
    iframe.width = '100%';
    iframe.height = '450';
    iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    iframe.sandbox.add('allow-forms', 'allow-popups', 'allow-popups-to-escape-sandbox', 'allow-same-origin', 'allow-scripts', 'allow-presentation');
    iframe.src = embedUrl;
    iframe.title = embedTitle || `SoundCloud playlist ${index + 1}`;
    iframe.style.border = 'none';

    placeholder.replaceWith(iframe);
    embed.dataset.loaded = 'true';
  }

  private setupEventListeners() {
    this.container.addEventListener('carousel:navigate', this.handleNavigationEvent.bind(this) as EventListener);
    this.container.addEventListener('pagination:navigate', this.handlePaginationEvent.bind(this) as EventListener);
    this.container.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  private handleNavigationEvent(event: Event) {
    const customEvent = event as CustomEvent;
    const { direction } = customEvent.detail;
    if (direction === 'next' && this.currentIndex < this.totalPlaylists - 1) {
      this.navigateToIndex(this.currentIndex + 1);
    } else if (direction === 'previous' && this.currentIndex > 0) {
      this.navigateToIndex(this.currentIndex - 1);
    }
  }

  private handlePaginationEvent(event: Event) {
    const customEvent = event as CustomEvent;
    const { index } = customEvent.detail;
    this.navigateToIndex(index);
  }

  private handleKeyboard(event: KeyboardEvent) {
    if (event.target !== this.container && !this.container.contains(event.target as Node)) {
      return;
    }
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (this.currentIndex > 0) {
          this.navigateToIndex(this.currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.currentIndex < this.totalPlaylists - 1) {
          this.navigateToIndex(this.currentIndex + 1);
        }
        break;
    }
  }

  private navigateToIndex(index: number) {
    if (index === this.currentIndex || index < 0 || index >= this.totalPlaylists) {
      return;
    }

    if (this.lazyLoad) {
      this.loadEmbed(index);
    }

    this.embeds[this.currentIndex]?.classList.remove('active');
    this.embeds[this.currentIndex]?.setAttribute('style', 'display: none;');

    this.currentIndex = index;
    this.embeds[this.currentIndex]?.classList.add('active');
    this.embeds[this.currentIndex]?.setAttribute('style', '');

    this.updateNavigationState();
    this.updatePaginationState();
    this.updateAccessibility();
  }

  private updateNavigationState() {
    const navigationControls = this.container.querySelector('.navigation-controls');
    if (navigationControls && (window as any).NavigationControlsHandler) {
      const handler = (navigationControls as any).navigationHandler;
      if (handler && handler.updateButtonStates) {
        handler.updateButtonStates(this.currentIndex, this.totalPlaylists);
      }
    }
  }

  private updatePaginationState() {
    const paginationIndicator = this.container.querySelector('[data-pagination-indicator]');
    if (paginationIndicator && (paginationIndicator as any).paginationHandler) {
      const handler = (paginationIndicator as any).paginationHandler;
      handler.updateState(this.currentIndex);
    }
  }

  private updateAccessibility() {
    if (this.liveRegion) {
      const currentPlaylist = this.playlists[this.currentIndex];
      const playlistTitle = currentPlaylist?.title || `Playlist ${this.currentIndex + 1}`;
      this.liveRegion.textContent = `Showing playlist ${this.currentIndex + 1} of ${this.totalPlaylists}: ${playlistTitle}`;
    }
  }
}

export function initCarousels(): void {
  const carousels = document.querySelectorAll<HTMLElement>('.soundcloud-playlist-carousel');
  carousels.forEach(carousel => {
    new SoundCloudPlaylistCarousel(carousel);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}
