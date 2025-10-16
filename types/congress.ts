export type Deadline = {
  id: string;
  name: string;
  date: string;
  time?: string;
};

export type Congress = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  date: string;
  description: string;
  submissionUrl?: string;
  bookChapterEditalUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  editalSections?: {
    id: string;
    title: string;
    content: string;
  }[];
  editalDates?: {
    openingDate?: string; 
    submissionDeadlines?: Deadline[];
    presentationDeadlines?: Deadline[];
    resultsDeadlines?: Deadline[];
    publicationDate?: string;
  };
};

export interface CongressData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
  submissionUrl?: string;
  bookChapterEditalUrl?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  faq: FAQItem[];
  contact: {
    email:string;
    whatsapp?: string;
    instagram?: string;
  };
  templateUrls?: {
    resumoExpandidoComId?: string;
    resumoExpandidoSemId?: string;
    apresentacaoOral?: string;
    eBanner?: string;
  };
  editalSections?: {
    id: string;
    title: string;
    content: string;
  }[];
  editalDates?: {
    openingDate?: string;
    submissionDeadlines?: Deadline[];
    presentationDeadlines?: Deadline[];
    resultsDeadlines?: Deadline[];
    publicationDate?: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}
