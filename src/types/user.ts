export interface UserStats {
  articlesRead: number;    
  savedArticles: number;    
  readingTime: string;      
}

export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  role: string;
}