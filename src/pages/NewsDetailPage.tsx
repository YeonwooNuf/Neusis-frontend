import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import './NewsDetailPage.css';
import type { ArticleDto } from '../types/article';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const categoryLabels: Record<string, string> = {
  POLITICS: 'Politics',
  ECONOMY: 'Economy',
  SOCIETY: 'Society',
  CULTURE: 'Culture',
  IT: 'IT',
  SPORTS: 'Sports',
  ENTERTAINMENT: 'Entertainment',
  ETC: 'Etc',
};

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch article detail');
        }

        const data: ArticleDto = await res.json();
        setArticle(data);
      } catch (e) {
        console.error(e);
        setError('기사 상세 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="news-detail-page">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }

  if (error || !article) {
    return (
      <PageContainer>
        <div className="news-detail-page">
          <Link to="/news" className="back-link">
            ← Back to News
          </Link>
          <p>{error ?? 'Article not found.'}</p>
        </div>
      </PageContainer>
    );
  }

  const displayDate = article.publishedAt ?? article.createdAt;

  return (
    <PageContainer>
      <div className="news-detail-page">
        <Link to="/news" className="back-link">
          ← Back to News
        </Link>

        <article className="news-article">
          <div className="article-header">
            <span className="article-category">
              {categoryLabels[article.category] ?? article.category}
            </span>
            <time className="article-date" dateTime={displayDate}>
              {formatDate(displayDate)}
            </time>
          </div>

          <h1 className="article-title">{article.title}</h1>

          <div className="article-meta">
            <div className="article-author">
              <span className="meta-label">Author:</span>
              <span className="meta-value">{article.author ?? '-'}</span>
            </div>
            <div className="article-source">
              <span className="meta-label">Source:</span>
              <span className="meta-value">{article.source ?? '-'}</span>
            </div>
          </div>

          <div className="article-content">
            {(article.content ?? '').split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="article-tags">
            <span className="tags-label">Tags:</span>
            <div className="tags-list">
              <span className="tag">
                {categoryLabels[article.category] ?? article.category}
              </span>
            </div>
          </div>
        </article>
      </div>
    </PageContainer>
  );
};

export default NewsDetailPage;