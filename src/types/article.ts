// src/types/article.ts 같이 분리해두면 깔끔
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

export interface ArticleDto {
  articleId: number;
  title: string;
  content: string;
  author: string | null;
  source: string | null;
  url: string;
  category: Category;
  publishedAt: string | null;
  ingestStatus: IngestStatus;
  createdAt: string;
  updatedAt: string;
}

// Spring Data Page 응답 형식
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 현재 페이지 (0-based)
  size: number;
}