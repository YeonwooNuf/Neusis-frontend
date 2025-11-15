import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import './NewsDetailPage.css';

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const mockNewsDetail = {
    id: id || '1',
    title: 'Tech Industry Sees Record Growth in Q4',
    content: `The technology sector has reported unprecedented growth, with major companies exceeding expectations in the final quarter of the year. This remarkable performance has been attributed to several key factors including increased digital transformation initiatives, strong consumer demand, and innovative product launches.

Leading technology firms have seen their stock prices surge as investors respond positively to the quarterly earnings reports. Industry analysts are noting that this growth pattern represents a significant shift from previous quarters, indicating a robust recovery and sustained momentum.

The data reveals that cloud computing services have been particularly strong, with enterprise adoption rates reaching new heights. Software-as-a-Service (SaaS) companies have also demonstrated exceptional performance, driven by the continued need for remote work solutions and digital collaboration tools.

Looking ahead, industry experts predict that this growth trajectory will continue into the next fiscal year, with particular strength expected in artificial intelligence, cybersecurity, and sustainable technology solutions. The sector's resilience and adaptability have positioned it well for future challenges and opportunities.`,
    source: 'Tech News Daily',
    author: 'Sarah Johnson',
    publishedAt: '2024-01-15T10:00:00Z',
    category: 'Technology',
    tags: ['Technology', 'Business', 'Innovation', 'Growth']
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <PageContainer>
      <div className="news-detail-page">
        <Link to="/news" className="back-link">
          ← Back to News
        </Link>

        <article className="news-article">
          <div className="article-header">
            <span className="article-category">{mockNewsDetail.category}</span>
            <time className="article-date" dateTime={mockNewsDetail.publishedAt}>
              {formatDate(mockNewsDetail.publishedAt)}
            </time>
          </div>

          <h1 className="article-title">{mockNewsDetail.title}</h1>

          <div className="article-meta">
            <div className="article-author">
              <span className="meta-label">Author:</span>
              <span className="meta-value">{mockNewsDetail.author}</span>
            </div>
            <div className="article-source">
              <span className="meta-label">Source:</span>
              <span className="meta-value">{mockNewsDetail.source}</span>
            </div>
          </div>

          <div className="article-content">
            {mockNewsDetail.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="article-tags">
            <span className="tags-label">Tags:</span>
            <div className="tags-list">
              {mockNewsDetail.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </PageContainer>
  );
};

export default NewsDetailPage;

