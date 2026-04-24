/**
 * Icon Configuration
 * Centralized mapping of icon names to FontAwesome classes
 * This makes it easy to maintain and change icons across the entire site
 */

export interface IconConfig {
  name: string;
  faClass: string;
  label: string;
}

// Social media icons
export const socialIcons: Record<string, IconConfig> = {
  github: {
    name: 'github',
    faClass: 'fab fa-github',
    label: 'GitHub'
  },
  twitter: {
    name: 'twitter',
    faClass: 'fab fa-twitter',
    label: 'Twitter'
  },
  linkedin: {
    name: 'linkedin',
    faClass: 'fab fa-linkedin',
    label: 'LinkedIn'
  },
  email: {
    name: 'email',
    faClass: 'fas fa-envelope',
    label: 'Email'
  },
  website: {
    name: 'website',
    faClass: 'fas fa-globe',
    label: 'Website'
  }
};

// Navigation and UI icons
export const uiIcons: Record<string, IconConfig> = {
  home: {
    name: 'home',
    faClass: 'fas fa-home',
    label: 'Home'
  },
  projects: {
    name: 'projects',
    faClass: 'fas fa-folder-open',
    label: 'Projects'
  },
  blog: {
    name: 'blog',
    faClass: 'fas fa-blog',
    label: 'Blog'
  },
  external: {
    name: 'external',
    faClass: 'fas fa-external-link-alt',
    label: 'External Link'
  },
  arrow: {
    name: 'arrow',
    faClass: 'fas fa-arrow-right',
    label: 'Arrow'
  },
  code: {
    name: 'code',
    faClass: 'fas fa-code',
    label: 'Code'
  },
  demo: {
    name: 'demo',
    faClass: 'fas fa-play',
    label: 'Demo'
  },
  view: {
    name: 'view',
    faClass: 'fas fa-eye',
    label: 'Views'
  },
  download: {
    name: 'download',
    faClass: 'fas fa-download',
    label: 'Download'
  }
};

// Project link icons
export const projectIcons: Record<string, IconConfig> = {
  github: socialIcons.github,
  live: {
    name: 'live',
    faClass: 'fas fa-external-link-alt',
    label: 'Live Site'
  },
  demo: uiIcons.demo
};

// All icons combined for easy lookup
export const allIcons: Record<string, IconConfig> = {
  ...socialIcons,
  ...uiIcons,
  ...projectIcons
};

/**
 * Get icon configuration by name
 * @param iconName - The name of the icon
 * @returns IconConfig object or undefined if not found
 */
export function getIcon(iconName: string): IconConfig | undefined {
  return allIcons[iconName];
}

/**
 * Get FontAwesome class for an icon
 * @param iconName - The name of the icon
 * @returns FontAwesome class string or empty string if not found
 */
export function getIconClass(iconName: string): string {
  const icon = getIcon(iconName);
  return icon ? icon.faClass : '';
}

/**
 * Get accessible label for an icon
 * @param iconName - The name of the icon
 * @returns Accessible label string or the icon name if not found
 */
export function getIconLabel(iconName: string): string {
  const icon = getIcon(iconName);
  return icon ? icon.label : iconName;
}