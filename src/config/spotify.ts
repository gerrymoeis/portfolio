/**
 * Spotify Embed Configuration
 * Configure your Spotify playlist/album embed here
 */

export interface SpotifyEmbedConfig {
  /** The Spotify embed URL (get this from Spotify's embed generator) */
  embedUrl: string;
  /** Height of the embed in pixels */
  height: number;
  /** Whether to use compact mode */
  compact: boolean;
  /** Description for accessibility */
  description: string;
}

/**
 * Individual Spotify playlist configuration
 */
export interface SpotifyPlaylist {
  /** Unique identifier for the playlist */
  id: string;
  /** Display title for the playlist */
  title: string;
  /** The Spotify embed URL */
  embedUrl: string;
  /** Optional description for accessibility and display */
  description?: string;
  /** Optional artist information */
  artist?: string;
}

/**
 * Carousel-specific settings
 */
export interface CarouselSettings {
  /** Whether to enable autoplay functionality */
  autoplay: boolean;
  /** Delay between autoplay transitions in milliseconds */
  autoplayDelay: number;
  /** Whether to show navigation controls */
  showControls: boolean;
  /** Whether to enable drag/swipe navigation */
  enableDrag: boolean;
  /** Drag threshold as percentage of panel width (0.0 to 1.0) */
  dragThreshold: number;
  /** Whether to respect user's reduced motion preferences */
  respectReducedMotion: boolean;
}

/**
 * Extended Spotify configuration supporting multiple playlists
 */
export interface SpotifyConfig {
  /** Array of playlists for carousel display */
  playlists: SpotifyPlaylist[];
  /** Carousel-specific settings */
  carouselSettings?: CarouselSettings;
  /** Legacy single embed configuration for backward compatibility */
  legacyEmbed?: SpotifyEmbedConfig;
}

/**
 * Validates a Spotify embed URL format
 * @param url - The URL to validate
 * @returns true if the URL is a valid Spotify embed URL
 */
export function validateSpotifyUrl(url: string): boolean {
  const spotifyEmbedPattern = /^https:\/\/open\.spotify\.com\/embed\/(playlist|album|track|artist)\/[a-zA-Z0-9]+(\?.*)?$/;
  return spotifyEmbedPattern.test(url);
}

/**
 * Validates an array of playlists, filtering out invalid ones
 * @param playlists - Array of playlists to validate
 * @returns Array of valid playlists and array of validation errors
 */
export function validatePlaylists(playlists: SpotifyPlaylist[]): {
  validPlaylists: SpotifyPlaylist[];
  errors: string[];
} {
  const validPlaylists: SpotifyPlaylist[] = [];
  const errors: string[] = [];

  playlists.forEach((playlist, index) => {
    // Validate required fields
    if (!playlist.id || !playlist.title || !playlist.embedUrl) {
      errors.push(`Playlist at index ${index}: Missing required fields (id, title, or embedUrl)`);
      return;
    }

    // Validate URL format
    if (!validateSpotifyUrl(playlist.embedUrl)) {
      errors.push(`Playlist "${playlist.title}" (${playlist.id}): Invalid Spotify embed URL format`);
      return;
    }

    // Validate ID format (should be alphanumeric and dashes)
    if (!/^[a-zA-Z0-9-_]+$/.test(playlist.id)) {
      errors.push(`Playlist "${playlist.title}": Invalid ID format (should contain only letters, numbers, dashes, and underscores)`);
      return;
    }

    validPlaylists.push(playlist);
  });

  return { validPlaylists, errors };
}

/**
 * Default Spotify configuration with multiple Octopath Traveler playlists
 */
export const spotifyConfig: SpotifyConfig = {
  playlists: [
    {
      id: "octopath-1",
      title: "Octopath Traveler Original Soundtrack",
      embedUrl: "https://open.spotify.com/embed/album/7CY5mNBTBbHs1a4apdKCq6"
    },
    {
      id: "octopath-2", 
      title: "Octopath Traveler 2 Original Soundtrack",
      embedUrl: "https://open.spotify.com/embed/album/1A7aVkSR8sgpgDqcPBEk9f"
    },
    {
      id: "octopath-cotc",
      title: "Octopath Traveler COTC Original Soundtrack", 
      embedUrl: "https://open.spotify.com/embed/album/2m7KCV7oHP8JShcizfkFYe"
    }
  ],
  carouselSettings: {
    autoplay: false,
    autoplayDelay: 5000,
    showControls: true,
    enableDrag: true,
    dragThreshold: 0.3,
    respectReducedMotion: true
  },
  // Maintain backward compatibility with existing single embed
  legacyEmbed: {
    embedUrl: "https://open.spotify.com/embed/playlist/6TSCZLAfFRFOViqZ9xMqY7?utm_source=generator",
    height: 352,
    compact: false,
    description: "Octopath OSTs"
  }
};

/**
 * Alternative embed configurations
 * Uncomment and modify as needed
 */

// Example: Compact playlist embed
// export const spotifyConfig: SpotifyEmbedConfig = {
//   embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX0XUsuxWHRQd?utm_source=generator",
//   height: 152,
//   compact: true,
//   description: "Compact Spotify playlist player"
// };

// Example: Artist embed
// export const spotifyConfig: SpotifyEmbedConfig = {
//   embedUrl: "https://open.spotify.com/embed/artist/4Z8W4fKeB5YxbusRsdQVPb?utm_source=generator",
//   height: 352,
//   compact: false,
//   description: "Spotify artist player"
// };

// Example: Single track embed
// export const spotifyConfig: SpotifyEmbedConfig = {
//   embedUrl: "https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh?utm_source=generator",
//   height: 152,
//   compact: true,
//   description: "Spotify single track player"
// };

/**
 * Carousel component interfaces and types
 */

/**
 * Props for the main SpotifyPlaylistCarousel component
 */
export interface CarouselProps {
  /** Array of playlists to display in the carousel */
  playlists: SpotifyPlaylist[];
  /** Whether to enable autoplay functionality */
  autoplay?: boolean;
  /** Whether to show navigation controls */
  showControls?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Carousel-specific settings */
  settings?: CarouselSettings;
}

/**
 * Internal state management for the carousel
 */
export interface CarouselState {
  /** Current active playlist index */
  currentIndex: number;
  /** Total number of playlists */
  totalPlaylists: number;
  /** Whether a transition is currently in progress */
  isTransitioning: boolean;
  /** Current drag interaction state */
  dragState: DragState;
  /** Carousel configuration settings */
  settings: CarouselSettings;
}

/**
 * Drag interaction state tracking
 */
export interface DragState {
  /** Whether a drag operation is currently active */
  isDragging: boolean;
  /** Starting X coordinate of the drag */
  startX: number;
  /** Current X coordinate during drag */
  currentX: number;
  /** Drag distance threshold for triggering navigation */
  threshold: number;
  /** Calculated velocity of the drag gesture */
  velocity: number;
  /** Timestamp when drag started */
  startTime: number;
}

/**
 * Navigation state for button controls
 */
export interface NavigationState {
  /** Current playlist index */
  currentIndex: number;
  /** Total number of playlists */
  totalPlaylists: number;
  /** Whether navigation to next playlist is possible */
  canGoNext: boolean;
  /** Whether navigation to previous playlist is possible */
  canGoPrevious: boolean;
}

/**
 * Event handlers for carousel interactions
 */
export interface CarouselEvents {
  /** Called when navigation occurs */
  onNavigate: (index: number) => void;
  /** Called when drag gesture starts */
  onDragStart: (event: PointerEvent) => void;
  /** Called during drag gesture movement */
  onDragMove: (event: PointerEvent) => void;
  /** Called when drag gesture ends */
  onDragEnd: (event: PointerEvent) => void;
  /** Called when pagination dot is clicked */
  onDotClick: (index: number) => void;
  /** Called when navigation button is clicked */
  onButtonClick: (direction: 'next' | 'previous') => void;
}

/**
 * Configuration for drag gesture handling
 */
export interface DragConfig {
  /** Drag distance threshold as percentage of panel width */
  threshold: number;
  /** Minimum velocity required for velocity-based navigation */
  velocityThreshold: number;
  /** Dampening factor for drag feedback */
  dampening: number;
  /** Whether to enable drag interactions */
  enabled: boolean;
}

/**
 * Pagination indicator configuration
 */
export interface PaginationConfig {
  /** Whether to show pagination dots */
  show: boolean;
  /** Whether dots are clickable for direct navigation */
  clickable: boolean;
  /** CSS class for styling pagination container */
  className?: string;
}

/**
 * Navigation controls configuration
 */
export interface NavigationConfig {
  /** Whether to show navigation buttons */
  show: boolean;
  /** Whether to show labels on buttons */
  showLabels: boolean;
  /** Custom labels for previous/next buttons */
  labels?: {
    previous: string;
    next: string;
  };
  /** CSS class for styling navigation container */
  className?: string;
}

/**
 * Accessibility configuration options
 */
export interface AccessibilityConfig {
  /** ARIA label for the carousel region */
  carouselLabel: string;
  /** ARIA live region politeness level */
  liveRegion: 'polite' | 'assertive' | 'off';
  /** Whether to announce playlist changes */
  announceChanges: boolean;
  /** Custom announcement template */
  announcementTemplate?: string;
}

/**
 * Complete carousel configuration combining all settings
 */
export interface CarouselConfiguration {
  /** Drag interaction settings */
  drag: DragConfig;
  /** Pagination indicator settings */
  pagination: PaginationConfig;
  /** Navigation controls settings */
  navigation: NavigationConfig;
  /** Accessibility settings */
  accessibility: AccessibilityConfig;
  /** General carousel settings */
  general: CarouselSettings;
}

/**
 * Default carousel configuration
 */
export const defaultCarouselConfig: CarouselConfiguration = {
  drag: {
    threshold: 0.3,
    velocityThreshold: 0.5,
    dampening: 0.8,
    enabled: true
  },
  pagination: {
    show: true,
    clickable: true,
    className: 'carousel-pagination'
  },
  navigation: {
    show: true,
    showLabels: false,
    labels: {
      previous: 'Previous playlist',
      next: 'Next playlist'
    },
    className: 'carousel-navigation'
  },
  accessibility: {
    carouselLabel: 'Spotify playlist carousel',
    liveRegion: 'polite',
    announceChanges: true,
    announcementTemplate: 'Now showing playlist {index} of {total}: {title}'
  },
  general: {
    autoplay: false,
    autoplayDelay: 5000,
    showControls: true,
    enableDrag: true,
    dragThreshold: 0.3,
    respectReducedMotion: true
  }
};