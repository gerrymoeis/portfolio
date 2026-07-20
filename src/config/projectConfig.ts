export type ProjectStatus = 'completed' | 'in-progress' | 'experimental' | 'archived';

export const statusDisplay: Record<ProjectStatus, { en: string; id: string }> = {
  'completed': { en: 'Completed', id: 'Selesai' },
  'in-progress': { en: 'In Progress', id: 'Dalam Proses' },
  'experimental': { en: 'Experimental', id: 'Eksperimental' },
  'archived': { en: 'Archived', id: 'Diarsipkan' }
};

export const linkKeys = ['github', 'live', 'demo'] as const;

export const linkDefaults: Record<string, string> = { github: 'GitHub', live: 'Live', demo: 'Demo' };

export const linkIcons: Record<string, string> = { github: 'fab fa-github', live: 'fas fa-external-link-alt', demo: 'fas fa-play-circle' };

export function linkLabel(key: string, linkTitles?: Record<string, string | undefined>): string {
  if (linkTitles && linkTitles[key]) {
    return linkTitles[key]!;
  }
  return linkDefaults[key] || key;
}

export function linkIcon(key: string, linkTitles?: Record<string, string | undefined>): string {
  if (linkTitles && linkTitles[key]) {
    const label = linkTitles[key]!;
    if (label !== 'Live' && label !== 'Demo') return 'fab fa-github';
  }
  return linkIcons[key] || 'fas fa-link';
}
