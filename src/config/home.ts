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
  target?: string;
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
      url: "mailto:gerrymoeis7@gmail.com", 
      icon: "email" 
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
      label: { id: "Pengalaman", en: "Experiences" }, 
      href: "/experiences",
      target: "_blank"
    },
    { 
      label: { id: "CV", en: "CV" }, 
      href: "/cv",
      target: "_blank"
    },
  ],
};

/**
 * Personal Information
 * Used for CV generation and meta tags
 */
export const personalInfo = {
  fullName: "Gerry Moeis Mahardika Dwi Putra",
  shortName: "Gerry Moeis",
  email: "gerrymoeis7@gmail.com",
  phone: "088293253626",
  github: "github.com/gerrymoeis",
  location: {
    id: "Surabaya, Indonesia",
    en: "Surabaya, Indonesia"
  },
  university: {
    id: "Universitas Negeri Surabaya",
    en: "State University of Surabaya"
  },
  role: {
    id: "Kepala Departemen Riset dan Teknologi - Himafortic",
    en: "Head of Research and Technology Department - Himafortic"
  },
  bio: {
    id: "Mahasiswa Teknik Informatika yang berfokus pada pengembangan web, penelitian teknologi, dan inovasi pendidikan pemrograman. Berpengalaman dalam memimpin tim dan mengembangkan solusi teknologi untuk berbagai kebutuhan.",
    en: "Computer Science student focused on web development, technology research, and programming education innovation. Experienced in leading teams and developing technology solutions for various needs."
  }
};

/**
 * Helper function to get text in current language
 */
export function getText(bilingualText: BilingualText): string {
  if (typeof window === 'undefined') return bilingualText.en;
  
  const lang = localStorage.getItem('portfolio-language') || 'en';
  return bilingualText[lang as 'en' | 'id'] || bilingualText.en;
}
