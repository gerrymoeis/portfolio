/**
 * Home Page Configuration
 * Bilingual support (Indonesian & English)
 */

export interface BilingualText {
  id: string; // Indonesian
  en: string; // English
}

export interface HeroConfig {
  title: string; // Name (same in both languages)
  subtitle: BilingualText;
  description: BilingualText;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavigationLink {
  label: BilingualText;
  href: string;
  hrefByLang?: {
    en: string;
    id: string;
  };
  target?: string;
  download?: boolean;
}

export interface HomeConfig {
  hero: HeroConfig;
  social: SocialLink[];
  navigation: NavigationLink[];
}

export const homeConfig: HomeConfig = {
  hero: {
    title: "Gerry Moeis",
    subtitle: {
      id: "Pengembang Web & Peneliti Teknologi",
      en: "Web Developer & Technology Researcher"
    },
    description: {
      id: "Membangun pengalaman web yang indah dan inovatif dengan fokus pada performa dan aksesibilitas",
      en: "Building beautiful and innovative web experiences with focus on performance and accessibility"
    },
  },
  social: [
    {
      name: "GitHub",
      url: "https://github.com/gerrymoeis",
      icon: "github"
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/gerrymoeis",
      icon: "linkedin"
    },
    {
      name: "Email",
      url: "mailto:gerrymoeis@gmail.com",
      icon: "email"
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@gerrymoeis",
      icon: "youtube"
    },
  ],
  navigation: [
    { 
      label: { id: "Beranda", en: "Home" }, 
      href: "/" 
    },
    { 
      label: { id: "Proyek", en: "Projects" }, 
      href: "/projects",
      target: "_blank"
    },
    { 
      label: { id: "Blog", en: "Blogs" }, 
      href: "/blogs",
      target: "_blank"
    },
    { 
      label: { id: "Musik", en: "Music" }, 
      href: "/music",
      target: "_blank"
    },
    { 
      label: { id: "CV", en: "CV" }, 
      href: "/Gerry Moeis_CV_EN.pdf", // Will be dynamically updated based on language
      hrefByLang: {
        en: "/Gerry Moeis_CV_EN.pdf",
        id: "/Gerry Moeis_CV_ID.pdf"
      },
      target: "_blank",
    },
  ],
};

/**
 * Personal Information
 * Used for CV generation and meta tags
 */
import { personal } from './personal.js';

export const personalInfo = {
  ...personal,
  location: {
    id: "Surabaya, Indonesia",
    en: "Surabaya, Indonesia"
  },
  university: {
    id: "Universitas Negeri Surabaya",
    en: "State University of Surabaya"
  },
  role: {
    id: "Tech & Programming Enthusiast",
    en: "Tech & Programming Enthusiast"
  },
  bio: {
    id: "Mahasiswa Teknik Informatika yang antusias dalam pengembangan web, eksplorasi teknologi baru, dan membangun solusi digital yang bermanfaat.",
    en: "Computer Science student passionate about web development, exploring new technologies, and building meaningful digital solutions."
  }
};


