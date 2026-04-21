/**
 * Home Page Configuration
 * Update this file with your personal information
 */

export interface HeroConfig {
  title: string;
  subtitle: string;
  description: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavigationLink {
  label: string;
  href: string;
  target?: string;
}

export interface HomeConfig {
  hero: HeroConfig;
  social: SocialLink[];
  navigation: NavigationLink[];
}

export const homeConfig: HomeConfig = {
  hero: {
    title: "Your Name",
    subtitle: "Frontend Engineer & Designer",
    description: "Building calm, beautiful web experiences",
  },
  social: [
    { name: "GitHub", url: "https://github.com/yourusername", icon: "github" },
    { name: "Twitter", url: "https://twitter.com/yourusername", icon: "twitter" },
    { name: "LinkedIn", url: "https://linkedin.com/in/yourusername", icon: "linkedin" },
  ],
  navigation: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects", target: "_blank" },
    { label: "Blogs", href: "/blogs", target: "_blank" },
  ],
};
