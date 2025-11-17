import { AnalysisDto } from "./analysis";

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

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
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
  viewCount?: number;
  ingestStatus: IngestStatus;
  analysis?: AnalysisDto | null;
}