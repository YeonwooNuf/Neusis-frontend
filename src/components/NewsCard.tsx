import { Link } from 'react-router-dom';
import './NewsCard.css';

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category?: string;
}

const NewsCard = ({ id, title, summary, source, publishedAt, category }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/news/${id}`} className="news-card">
      <div className="news-card-header">
        {category && <span className="news-card-category">{category}</span>}
        <span className="news-card-date">{formatDate(publishedAt)}</span>
      </div>
      <h3 className="news-card-title">{title}</h3>
      <p className="news-card-summary">{summary}</p>
      <div className="news-card-footer">
        <span className="news-card-source">{source}</span>
      </div>
    </Link>
  );
};

export default NewsCard;

