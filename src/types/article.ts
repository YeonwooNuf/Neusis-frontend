// src/types/article.ts

export type Category =
  | 'POLITICS'
  | 'ECONOMY'
  | 'SOCIETY'
  | 'CULTURE'
  | 'IT'
  | 'SPORTS'
  | 'ENTERTAINMENT'
  | 'ETC';

export type IngestStatus = 'PENDING' | 'ANALYZED' | 'FAILED';

export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface AnalysisDto {
  resultId: number;
  articleId: number;
  summary: string;
  sentiment: Sentiment;
  keywords: string[];
  trendScore: number | null;
  processedAt: string | null;
  createdAt: string;
}

export interface ArticleDto {
  articleId: number;
  title: string;
  content: string | null;
  author: string | null;
  source: string | null;
  url: string;
  category: Category;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  ingestStatus: IngestStatus;
  analysis?: AnalysisDto | null;
}