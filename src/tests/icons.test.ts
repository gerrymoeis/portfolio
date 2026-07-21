import { describe, it, expect } from 'vitest';
import { getIcon, socialIcons, uiIcons } from '../config/icons';

describe('Icon Configuration', () => {
  it('should return correct icon configuration for social icons', () => {
    const githubIcon = getIcon('github');
    expect(githubIcon).toBeDefined();
    expect(githubIcon?.name).toBe('github');
    expect(githubIcon?.svg).toContain('<svg');
    expect(githubIcon?.svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(githubIcon?.svg).toContain('fill="currentColor"');
    expect(githubIcon?.svg).toContain('<path');
    expect(githubIcon?.label).toBe('GitHub');
  });

  it('should handle unknown icons gracefully', () => {
    expect(getIcon('unknown')).toBeUndefined();
  });

  it('should have all required social icons', () => {
    const requiredSocialIcons = ['github', 'linkedin'];
    requiredSocialIcons.forEach(iconName => {
      expect(socialIcons[iconName]).toBeDefined();
      expect(socialIcons[iconName].svg).toContain('<svg');
    });
  });

  it('should have all required UI icons', () => {
    const requiredUIIcons = ['home', 'projects', 'blog', 'external', 'arrow'];
    requiredUIIcons.forEach(iconName => {
      expect(uiIcons[iconName]).toBeDefined();
      expect(uiIcons[iconName].svg).toContain('<svg');
    });
  });

  it('should have valid SVG markup for all icons', () => {
    Object.values(socialIcons).forEach(icon => {
      expect(icon.svg).toContain('<svg');
      expect(icon.svg).toContain('</svg>');
      expect(icon.svg).toContain('fill="currentColor"');
    });

    Object.values(uiIcons).forEach(icon => {
      expect(icon.svg).toContain('<svg');
      expect(icon.svg).toContain('</svg>');
      expect(icon.svg).toContain('fill="currentColor"');
    });
  });
});
