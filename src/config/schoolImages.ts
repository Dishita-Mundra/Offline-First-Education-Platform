/**
 * Centralized School Branding & Image Configuration
 * -------------------------------------------------
 * Replace any image path below with your own school logo, campus photography,
 * classroom photos, student portraits, or teacher images stored in:
 *   /src/assets/images/   (or /public/images/...)
 *
 * When `logo.customLogoSrc` is set to an image URL (e.g. '/src/assets/images/school_logo.png'),
 * the header, login, and dashboard Logo component automatically switches from the
 * built-in Navy & Gold crest to your official school logo image.
 */

export const SCHOOL_BRAND = {
  name: 'Indo American School',
  fullUpperName: 'INDO AMERICAN SCHOOL',
  shortName: 'IAS',
  tagline: 'Empowering Young Minds, Building Bright Futures.',
  board: 'CBSE',
  supportEmail: 'admissions@indoamericanschool.edu.in',
  locationLabel: 'CBSE Classes 1–10 · English & Hindi Mediums · India',
} as const;

export interface SchoolImageAsset {
  src: string;
  alt: string;
  caption: string;
  fallbackBg: string;
}

export const SCHOOL_IMAGES = {
  logo: {
    /**
     * Set `customLogoSrc` to a real logo file path (e.g. '/src/assets/images/school_logo.png')
     * when ready to replace the default Navy & Gold Indo American School Crest.
     */
    customLogoSrc: '' as string,
    alt: 'Indo American School Crest Logo',
  },
  heroCampus: {
    src: '/src/assets/images/campus_hero_placeholder.jpg',
    alt: 'Indo American School student engaged in smart digital learning',
    caption: 'Smart Digital Campus · Offline-Ready CBSE Learning',
    fallbackBg: 'bg-sky-50',
  },
  campusAbout: {
    src: '/src/assets/images/classroom_offline_placeholder.jpg',
    alt: 'Indo American School classroom offline synchronization architecture',
    caption: 'Uninterrupted Classroom & Home Study Synchronization',
    fallbackBg: 'bg-blue-50',
  },
  scienceLab: {
    src: '/src/assets/images/science_lab_placeholder.jpg',
    alt: 'Indo American School Science and STEM laboratory learning module',
    caption: 'Science & STEM Discovery Labs',
    fallbackBg: 'bg-sky-50',
  },
  mathAcademy: {
    src: '/src/assets/images/math_academy_placeholder.jpg',
    alt: 'Indo American School Mathematics and Geometry visual academy',
    caption: 'Mathematics & Analytical Reasoning',
    fallbackBg: 'bg-amber-50',
  },
  studentSpotlight: {
    src: '/src/assets/images/campus_hero_placeholder.jpg',
    alt: 'Indo American School Student Portal preview',
    caption: 'Student Learning Portal · Classes 1 to 10',
    fallbackBg: 'bg-sky-50',
  },
  teacherSpotlight: {
    src: '/src/assets/images/science_lab_placeholder.jpg',
    alt: 'Indo American School Faculty & Teacher Studio preview',
    caption: 'Faculty Academic Studio',
    fallbackBg: 'bg-blue-50',
  },
} satisfies Record<string, SchoolImageAsset | { customLogoSrc: string; alt: string }>;
