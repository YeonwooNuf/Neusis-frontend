import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import './NewsDetailPage.css';
import type { ArticleDto } from '../types/article';
import type { AnalysisDto } from '../types/analysis';
import { useAuth } from '../contexts/AuthContext';
import BookmarkIcon from '../components/BookmarkIcon';

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

const sentimentLabels: Record<string, string> = {
  POSITIVE: '긍정적',
  NEGATIVE: '부정적',
  NEUTRAL: '중립적',
};

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();

  const [article, setArticle] = useState<ArticleDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 북마크 상태
  const [isLiked, setIsLiked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // 1) 기사 상세 조회
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

  // 2) 조회 기록 + 누적 조회수 증가 API 호출
  useEffect(() => {
    if (!id || !isAuthenticated || !user) return;

    const recordView = async () => {
      try {
        await fetch(`${API_BASE_URL}/users/${user.id}/articles/${id}/view`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (e) {
        console.error('조회 기록 API 호출 실패', e);
      }
    };

    recordView();
  }, [id, isAuthenticated, user]);

  // 3) 초기 좋아요 여부 조회
  useEffect(() => {
    if (!id || !isAuthenticated || !user) return;

    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/users/${user.id}/articles/${id}/like`,
          {
            method: 'GET',
            credentials: 'include',
          },
        );

        if (res.ok) {
          const liked = await res.json(); // true or false
          setIsLiked(liked);
        }
      } catch (e) {
        console.error('좋아요 상태 조회 실패', e);
      }
    };

    fetchLikeStatus();
  }, [id, isAuthenticated, user]);

  // 4) 북마크 토글 핸들러
  const handleToggleBookmark = async () => {
    if (!id || !isAuthenticated || !user) {
      alert('로그인 후 북마크를 사용할 수 있습니다.');
      return;
    }

    if (bookmarkLoading) return;

    try {
      setBookmarkLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/users/${user.id}/articles/${id}/like`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      if (!res.ok) {
        throw new Error('Failed to toggle bookmark');
      }

      const liked: boolean = await res.json();
      setIsLiked(liked);
    } catch (e) {
      console.error('북마크 토글 실패', e);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
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
  const analysis: AnalysisDto | null = article.analysis ?? null;

  return (
    <PageContainer>
      <div className="news-detail-page">
        <Link to="/news" className="back-link">
          ← Back to News
        </Link>

        {/* ========== 기사 원문 ========== */}
        <article className="news-article">
          {/* 헤더 */}
          <div className="article-header">
            <span className="article-category">
              {categoryLabels[article.category] ?? article.category}
            </span>

            <div className="article-header-right">
              <div className="right-top-row">
                <time className="article-date" dateTime={displayDate}>
                  {formatDate(displayDate)}
                </time>

                <button
                  type="button"
                  className={`bookmark-btn ${isLiked ? 'bookmark-btn-active' : ''}`}
                  onClick={handleToggleBookmark}
                  disabled={bookmarkLoading || !isAuthenticated}
                >
                  <BookmarkIcon filled={isLiked} />
                </button>
              </div>
            </div>
          </div>

          {/* 메타 + 원문 보기 한 줄로 */}
          <div className="article-meta-row">
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

            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="article-original-link"
              >
                원문 보기 →
              </a>
            )}
          </div>

          {article.imageUrl && (
            <div className="article-image-wrapper">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="article-image"
              />
            </div>
          )}

          <div className="article-content">
            {(article.content ?? '')
              .split(/\n+/)
              .map((paragraph, idx) => (
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

        {/* ========== 분석 결과 ========== */}
        <section className="analysis-section">
          <h2 className="analysis-title">AI 분석 결과</h2>

          <div className="analysis-status">
            <span className="metric-label">분석 상태</span>
            <span
              className={`status-badge status-${article.ingestStatus.toLowerCase()}`}
            >
              {article.ingestStatus === 'PENDING'
                ? '분석 대기중'
                : article.ingestStatus === 'ANALYZED'
                  ? '분석 완료'
                  : '분석 실패'}
            </span>
          </div>

          {analysis ? (
            <>
              <div className="analysis-summary">
                <h3 className="analysis-subtitle">요약</h3>
                <p className="analysis-summary-text">
                  {analysis.summary || '요약 결과가 없습니다.'}
                </p>
              </div>

              <div className="analysis-metrics">
                <div className="analysis-metric">
                  <div className="metric-header">
                    <span className="metric-label">감정 분석</span>
                    {analysis.sentiment ? (
                      <span
                        className={`sentiment-badge sentiment-${analysis.sentiment.toLowerCase()}`}
                      >
                        {sentimentLabels[analysis.sentiment]}
                      </span>
                    ) : (
                      <span className="sentiment-badge sentiment-neutral">
                        분석 없음
                      </span>
                    )}
                  </div>
                </div>

                <div className="analysis-metric">
                  <div className="metric-header">
                    <span className="metric-label">트렌드 점수</span>
                    <span className="trend-score-value">
                      {analysis.trendScore != null
                        ? `${(analysis.trendScore * 100).toFixed(0)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="trend-score-bar">
                    <div
                      className="trend-score-fill"
                      style={{
                        width: `${analysis.trendScore != null
                          ? analysis.trendScore * 100
                          : 0
                          }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="analysis-keywords">
                <h3 className="analysis-subtitle">주요 키워드</h3>
                <div className="keywords-list">
                  {analysis.keywords && analysis.keywords.length > 0 ? (
                    analysis.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-badge">
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <span className="keyword-empty">
                      키워드 분석 결과가 없습니다.
                    </span>
                  )}
                </div>
              </div>

              <div className="analysis-footer">
                <span className="analysis-processed-time">
                  분석 완료: {formatDate(analysis.processedAt)}
                </span>
              </div>
            </>
          ) : (
            <p className="analysis-placeholder">
              아직 이 기사에 대한 분석 결과가 없습니다.
            </p>
          )}
        </section>
      </div>
    </PageContainer>
  );
};

export default NewsDetailPage;