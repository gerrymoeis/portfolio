import { projectIcons } from './icons';

export type ProjectStatus = 'completed' | 'in-progress' | 'experimental' | 'archived';

export const statusDisplay: Record<ProjectStatus, { en: string; id: string }> = {
  'completed': { en: 'Completed', id: 'Selesai' },
  'in-progress': { en: 'In Progress', id: 'Dalam Proses' },
  'experimental': { en: 'Experimental', id: 'Eksperimental' },
  'archived': { en: 'Archived', id: 'Diarsipkan' }
};

export const linkKeys = ['github', 'live', 'demo'] as const;

export const linkDefaults: Record<string, string> = { github: 'GitHub', live: 'Live', demo: 'Demo' };

export function linkLabel(key: string, linkTitles?: Record<string, string | undefined>): string {
  if (linkTitles && linkTitles[key]) {
    return linkTitles[key]!;
  }
  return linkDefaults[key] || key;
}

export function linkIcon(key: string, _linkTitles?: Record<string, string | undefined>): string {
  if (projectIcons[key]) return key;
  return 'external';
}
