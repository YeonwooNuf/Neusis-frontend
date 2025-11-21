export interface UserStats {
  articlesRead: number;    
  savedArticles: number;    
  streakDays: number;    
}

export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  role: string;
}