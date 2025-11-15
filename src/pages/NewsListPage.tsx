import { useState } from 'react';
import PageContainer from '../components/PageContainer';
import NewsCard from '../components/NewsCard';
import './NewsListPage.css';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: string;
}

const NewsListPage = () => {
  const [filter, setFilter] = useState<string>('all');

  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'Tech Industry Sees Record Growth in Q4',
      summary: 'The technology sector has reported unprecedented growth, with major companies exceeding expectations in the final quarter of the year.',
      source: 'Tech News Daily',
      publishedAt: '2024-01-15T10:00:00Z',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Global Climate Summit Reaches Historic Agreement',
      summary: 'World leaders have reached a consensus on new climate targets, marking a significant milestone in environmental policy.',
      source: 'Global Times',
      publishedAt: '2024-01-14T14:30:00Z',
      category: 'Environment'
    },
    {
      id: '3',
      title: 'Healthcare Innovation Breakthrough Announced',
      summary: 'Researchers have developed a new treatment method that shows promising results in clinical trials.',
      source: 'Medical Journal',
      publishedAt: '2024-01-13T09:15:00Z',
      category: 'Health'
    },
    {
      id: '4',
      title: 'Economic Markets Show Strong Recovery Signs',
      summary: 'Financial markets are demonstrating resilience with positive indicators across multiple sectors.',
      source: 'Finance Weekly',
      publishedAt: '2024-01-12T16:45:00Z',
      category: 'Finance'
    },
    {
      id: '5',
      title: 'Space Exploration Mission Launches Successfully',
      summary: 'The latest space mission has launched without issues, beginning its journey to explore distant planets.',
      source: 'Space News',
      publishedAt: '2024-01-11T11:20:00Z',
      category: 'Science'
    },
    {
      id: '6',
      title: 'Sports Championship Breaks Viewership Records',
      summary: 'This year\'s championship event has attracted the largest audience in history, setting new benchmarks.',
      source: 'Sports Central',
      publishedAt: '2024-01-10T20:00:00Z',
      category: 'Sports'
    }
  ];

  const categories = ['all', 'Technology', 'Environment', 'Health', 'Finance', 'Science', 'Sports'];
  
  const filteredNews = filter === 'all' 
    ? mockNews 
    : mockNews.filter(news => news.category.toLowerCase() === filter.toLowerCase());

  return (
    <PageContainer>
      <div className="news-list-page">
        <div className="news-list-header">
          <h1 className="page-title">News Articles</h1>
          <p className="page-subtitle">Browse and analyze the latest news from around the world</p>
        </div>

        <div className="news-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="news-grid">
          {filteredNews.length > 0 ? (
            filteredNews.map(news => (
              <NewsCard
                key={news.id}
                id={news.id}
                title={news.title}
                summary={news.summary}
                source={news.source}
                publishedAt={news.publishedAt}
                category={news.category}
              />
            ))
          ) : (
            <div className="no-results">
              <p>No news articles found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default NewsListPage;

