export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

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