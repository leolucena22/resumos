export interface Deadline {
  id: string;
  name: string;
  date: string;
  time?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface EditalSection {
  id: string;
  title: string;
  content: string;
}

export interface Congress {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  date: string;
  description: string;
  submissionUrl?: string;
  bookChapterEditalUrl?: string;
  isChatEnabled?: boolean;
  trainingData?: string;
  trainingFileUrls?: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  aiConfig?: {
    provider: 'gemini' | 'openai';
    apiKeys?: {
      gemini?: string;
      openai?: string;
    };
    model?: string;
  };
  faq: FAQItem[];
  contact: {
    email: string;
    whatsapp?: string;
    instagram?: string;
  };
  templateUrls?: {
    resumoExpandidoComId?: string;
    resumoExpandidoSemId?: string;
    apresentacaoOral?: string;
    eBanner?: string;
  };
  editalSections?: EditalSection[];
  editalDates?: {
    openingDate?: string;
    submissionDeadlines?: Deadline[];
    presentationDeadlines?: Deadline[];
    resultsDeadlines?: Deadline[];
    publicationDate?: string;
  };
}
