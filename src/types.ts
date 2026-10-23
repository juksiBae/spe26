export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  fullText: string;
  image: string;
  createdAt?: string;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  major: string;
  studyYear: string;
  motivation: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  accentTitle?: string;
  subtitle: string;
  description: string;
  image: string;
  cta1?: string;
  cta1Link?: string;
  cta2?: string;
  cta2Link?: string;
  createdAt?: string;
  isDeleted?: boolean;
  imageLayout?: 'background' | 'split';
}

export interface SectionBackground {
  id: string;
  sectionName: string;
  backgroundImage: string;
  backgroundColor?: string;
  textColor?: 'light' | 'dark';
  overlayOpacity?: number;
  updatedAt?: string;
}

export interface Reward {
  id: string;
  title: string;
  category?: string;
  year: string;
  description: string;
  image: string;
  createdAt?: string;
  isDeleted?: boolean;
}

export interface SpeTriviaItem {
  id: string;
  title: string;
  category: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'General' | 'Dasar' | 'Menengah' | 'Lanjutan';
  description: string;
  image: string;
  fileType?: 'docx' | 'pdf' | 'doc';
  docxFileName: string;
  docxFileSize?: string;
  docxFileUrl?: string; // Data URL or external link
  docxData?: string; // Base64 or raw text/content
  questionCount?: number;
  tags?: string[];
  keyFacts?: string[];
  previewQuestions?: {
    q: string;
    options: string[];
    answerIdx: number;
    explanation: string;
  }[];
  createdAt?: string;
  downloadsCount?: number;
  isDeleted?: boolean;
}



