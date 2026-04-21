/**
 * Icon Configuration Tests
 * Validates that icon configuration is working correctly
 */

import { describe, it, expect } from 'vitest';
import { getIcon, getIconClass, getIconLabel, socialIcons, uiIcons } from '../config/icons';

describe('Icon Configuration', () => {
  it('should return correct icon configuration for social icons', () => {
    const githubIcon = getIcon('github');
    expect(githubIcon).toBeDefined();
    expect(githubIcon?.name).toBe('github');
    expect(githubIcon?.faClass).toBe('fab fa-github');
    expect(githubIcon?.label).toBe('GitHub');
  });

  it('should return correct FontAwesome classes', () => {
    expect(getIconClass('github')).toBe('fab fa-github');
    expect(getIconClass('twitter')).toBe('fab fa-twitter');
    expect(getIconClass('linkedin')).toBe('fab fa-linkedin');
    expect(getIconClass('home')).toBe('fas fa-home');
    expect(getIconClass('projects')).toBe('fas fa-folder-open');
  });

  it('should return correct labels', () => {
    expect(getIconLabel('github')).toBe('GitHub');
    expect(getIconLabel('twitter')).toBe('Twitter');
    expect(getIconLabel('linkedin')).toBe('LinkedIn');
    expect(getIconLabel('home')).toBe('Home');
  });

  it('should handle unknown icons gracefully', () => {
    expect(getIcon('unknown')).toBeUndefined();
    expect(getIconClass('unknown')).toBe('');
    expect(getIconLabel('unknown')).toBe('unknown');
  });

  it('should have all required social icons', () => {
    const requiredSocialIcons = ['github', 'twitter', 'linkedin'];
    requiredSocialIcons.forEach(iconName => {
      expect(socialIcons[iconName]).toBeDefined();
      expect(socialIcons[iconName].faClass).toContain('fa-');
    });
  });

  it('should have all required UI icons', () => {
    const requiredUIIcons = ['home', 'projects', 'blog', 'external', 'arrow'];
    requiredUIIcons.forEach(iconName => {
      expect(uiIcons[iconName]).toBeDefined();
      expect(uiIcons[iconName].faClass).toContain('fa-');
    });
  });

  it('should use consistent FontAwesome prefixes', () => {
    // Social icons should use 'fab' (FontAwesome Brands)
    Object.values(socialIcons).forEach(icon => {
      if (['github', 'twitter', 'linkedin'].includes(icon.name)) {
        expect(icon.faClass).toMatch(/^fab fa-/);
      }
    });

    // UI icons should use 'fas' (FontAwesome Solid)
    Object.values(uiIcons).forEach(icon => {
      expect(icon.faClass).toMatch(/^fas fa-/);
    });
  });
});