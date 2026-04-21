/**
 * Spotify Embed Controller
 * Creates Spotify iframe using iframe API and detects playback state
 */

interface SpotifyEmbedController {
  loadUri: (uri: string, options?: any) => void;
  play: () => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  addListener: (event: string, callback: (data: any) => void) => void;
  removeListener: (event: string, callback: (data: any) => void) => void;
}

interface IFrameAPI {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string; height?: number },
    callback: (controller: SpotifyEmbedController) => void
  ) => void;
}

class SpotifyEmbedManager {
  private controller: SpotifyEmbedController | null = null;
  private isReady = false;
  private lastKnownState: boolean = false;
  private debounceTimer: number | null = null;
  private pendingState: boolean | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // Wait for Spotify iframe API to be ready
    if (typeof window !== 'undefined') {
      (window as any).onSpotifyIframeApiReady = (IFrameAPI: IFrameAPI) => {
        this.setupController(IFrameAPI);
      };
    }
  }

  private setupController(IFrameAPI: IFrameAPI) {
    const container = document.getElementById('spotify-embed-container');
    if (!container) {
      return;
    }

    const uri = container.dataset.spotifyUri;
    const height = parseInt(container.dataset.height || '352', 10);

    if (!uri) {
      return;
    }

    const options = {
      uri: uri,
      width: '100%',
      height: height
    };

    IFrameAPI.createController(container, options, (controller: SpotifyEmbedController) => {
      this.controller = controller;
      this.isReady = true;

      // Make controller globally accessible
      (window as any).spotifyController = controller;
      
      // Notify that controller is ready
      document.dispatchEvent(new CustomEvent('spotify:ready', { detail: { controller } }));
      
      // Listen to playback_update events from Spotify iframe API
      controller.addListener('playback_update', (data: any) => {
        this.handlePlaybackUpdate(data);
      });
      
      // Also listen to ready event as fallback
      controller.addListener('ready', () => {
        // Spotify embed ready
      });
    });
  }

  private handlePlaybackUpdate(data: any) {
    // Spotify sends playback_update events with nested data structure
    // The data format can vary, so we need to be defensive
    
    if (typeof data !== 'object' || data === null) {
      return;
    }

    // The actual playback data might be nested or direct
    const playbackData = data.data || data;
    
    // Try multiple property names that Spotify might use
    let isPlaying: boolean | null = null;
    
    if (typeof playbackData.isPaused === 'boolean') {
      isPlaying = !playbackData.isPaused;
    } else if (typeof playbackData.is_paused === 'boolean') {
      isPlaying = !playbackData.is_paused;
    } else if (typeof playbackData.is_playing === 'boolean') {
      isPlaying = playbackData.is_playing;
    } else if (typeof playbackData.isPlaying === 'boolean') {
      isPlaying = playbackData.isPlaying;
    }
    
    // If we couldn't determine the state, ignore this event
    if (isPlaying === null) {
      return;
    }
    
    // Store the pending state
    this.pendingState = isPlaying;
    
    // Clear any existing debounce timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    
    // Debounce for 300ms to handle noisy events and rapid clicks
    // This is longer than before to be more stable
    this.debounceTimer = window.setTimeout(() => {
      // Only notify if the final state is different from last known state
      if (this.pendingState !== null && this.lastKnownState !== this.pendingState) {
        this.lastKnownState = this.pendingState;
        this.notifyPlaybackState(this.pendingState);
      }
      this.pendingState = null;
      this.debounceTimer = null;
    }, 300);
  }

  private notifyPlaybackState(isPlaying: boolean) {
    document.dispatchEvent(new CustomEvent('spotify:playback', {
      detail: { isPlaying }
    }));
  }

  public getController(): SpotifyEmbedController | null {
    return this.controller;
  }

  public isControllerReady(): boolean {
    return this.isReady;
  }

  // Method to load a new URI (for carousel navigation)
  public loadUri(uri: string) {
    if (this.controller) {
      this.controller.loadUri(uri);
      // Reset state when changing tracks
      this.lastKnownState = false;
      this.notifyPlaybackState(false);
    }
  }

  // Manual controls for testing
  public manualPlay() {
    this.lastKnownState = true;
    this.notifyPlaybackState(true);
  }

  public manualPause() {
    this.lastKnownState = false;
    this.notifyPlaybackState(false);
  }
}

// Initialize manager
const manager = new SpotifyEmbedManager();

// Global access
if (typeof window !== 'undefined') {
  (window as any).spotifyEmbedManager = manager;
}

export default manager;
