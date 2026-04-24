/**
 * SoundCloud Playlist Configuration
 * Octopath Traveler soundtrack playlists with universal amber color (#ffa600)
 * that works well in both light and dark themes
 */

export interface SoundCloudPlaylist {
  /** Unique identifier for the playlist */
  id: string;
  /** Display title for the playlist */
  title: string;
  /** Artist name */
  artist: string;
  /** The SoundCloud embed URL */
  embedUrl: string;
  /** Optional description for accessibility */
  description?: string;
}

/**
 * SoundCloud Playlists
 * Universal amber color (#ffa600) optimized for both themes
 */
export const soundCloudPlaylists: SoundCloudPlaylist[] = [
  {
    id: 'octopath-1',
    title: 'Octopath Traveler OST',
    artist: 'RoxlinkZ 🌀',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A561457083&color=%23ffa600&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
    description: 'Octopath Traveler Original Soundtrack - Full'
  },
  {
    id: 'octopath-2',
    title: 'Octopath Traveler 2 Soundtrack',
    artist: 'InfiniteShadow',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1925643635&color=%23ffa600&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
    description: 'Octopath Traveler 2 Original Soundtrack'
  },
  {
    id: 'octopath-0',
    title: 'OCTOPATH TRAVELER 0 OST',
    artist: 'RoxlinkZ 🌀',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A2155948367&color=%23ffa600&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
    description: 'OCTOPATH TRAVELER 0 Original Soundtrack'
  }
];
