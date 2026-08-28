export type Project = {
  title: string;
  slug: string;
  category: 'theater' | 'dance' | 'architecture' | 'exhibition';
  year: string;
  company?: string;
  venue?: string;
  cover: string;
  gallery: string[];
  credits?: string;
  selected?: 'Selected' | 'Upcoming';
  landing?: boolean;
};

// This is the Git-managed CMS source. Replace or extend it with the Framer export
// before the public cutover; the site builds its lists and detail pages from here.
export const projects: Project[] = [
  {
    title: 'The Water', slug: 'the-water', category: 'theater', year: '2025',
    company: 'Objet Petit L', venue: 'Taipei',
    cover: '/images/placeholder-stage.svg', gallery: ['/images/placeholder-stage.svg'],
    credits: 'Lighting Design — 黃俊諺', landing: true, selected: 'Selected'
  },
  {
    title: 'Woyzeck', slug: 'woyzeck', category: 'theater', year: '2024',
    company: 'Objet Petit L', venue: 'Taipei',
    cover: '/images/placeholder-stage.svg', gallery: ['/images/placeholder-stage.svg'],
    credits: 'Lighting Design — 黃俊諺', landing: true
  },
  {
    title: 'Dance Projects', slug: 'dance-projects', category: 'dance', year: '2024',
    company: 'Objet Petit L', venue: 'Taipei',
    cover: '/images/placeholder-stage.svg', gallery: ['/images/placeholder-stage.svg'],
    credits: 'Lighting Design — 黃俊諺', landing: true, selected: 'Upcoming'
  },
  {
    title: 'Lighting Rendering', slug: 'lighting-rendering', category: 'architecture', year: '2024',
    company: 'Objet Petit L', venue: 'Taipei',
    cover: '/images/placeholder-stage.svg', gallery: ['/images/placeholder-stage.svg'],
    credits: 'Lighting Design — 黃俊諺'
  }
];

export const categories = [
  { slug: 'theater', label: '劇場', english: 'Theatre' },
  { slug: 'dance', label: '舞蹈', english: 'Dance' },
  { slug: 'architecture', label: '建築與空間', english: 'Architecture & Spatial' },
  { slug: 'exhibition', label: '展覽與品牌活動', english: 'Exhibition & Branding Event' }
] as const;
