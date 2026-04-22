/**
 * SoundCloud Playlist Configuration
 * Configure SoundCloud playlists for the carousel
 */

export interface SoundCloudPlaylist {
  /** Unique identifier for the playlist */
  id: string;
  /** Display title for the playlist */
  title: string;
  /** The SoundCloud embed URL */
  embedUrl: string;
  /** Optional description for accessibility */
  description?: string;
}

/**
 * SoundCloud Playlists
 * Octopath Traveler soundtrack playlists
 */
export const soundCloudPlaylists: SoundCloudPlaylist[] = [
  {
    id: 'octopath-1',
    title: 'Octopath Traveler OST - Part 1',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1883799138&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
    description: 'Octopath Traveler Original Soundtrack - Part 1'
  },
  {
    id: 'octopath-2',
    title: 'Octopath Traveler OST - Part 2',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1883799309&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
    description: 'Octopath Traveler Original Soundtrack - Part 2'
  },
  {
    id: 'octopath-2-ost',
    title: 'Octopath Traveler II OST',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1883799417&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
    description: 'Octopath Traveler II Original Soundtrack'
  }
];
