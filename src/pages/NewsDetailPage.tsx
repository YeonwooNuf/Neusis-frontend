import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import './NewsDetailPage.css';
import type { ArticleDto, AnalysisDto } from '../types/article';
import { useAuth } from '../contexts/AuthContext';

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
    // id 또는 user 없으면 호출 X
    if (!id || !isAuthenticated || !user) return;

    const recordView = async () => {
      try {
        await fetch(
          `${API_BASE_URL}/users/${user.id}/articles/${id}/view`,
          {
            method: 'POST',
            credentials: 'include',
          },
        );
        // 응답 값으로 최신 viewCount를 다시 내려주도록 만들었다면,
        // 여기서 setArticle((prev) => prev && { ...prev, viewCount: newValue }) 갱신 가능.
      } catch (e) {
        console.error('조회 기록 API 호출 실패', e);
      }
    };

    recordView();
  }, [id]);

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
          <div className="article-header">
            <span className="article-category">
              {categoryLabels[article.category] ?? article.category}
            </span>
            <time className="article-date" dateTime={displayDate}>
              {formatDate(displayDate)}
            </time>
          </div>

          <h1 className="article-title">{article.title}</h1>

          {/* ✅ 조회 정보 영역 */}
          <div className="article-views">
            <div className="article-views-item">
              <span className="meta-label">누적 조회수</span>
              <span className="meta-value">
                {(article.viewCount ?? 0).toLocaleString()}회
              </span>
            </div>
          </div>

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
            {(article.content ?? '')
              .split('\n\n')
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
              {/* 요약 */}
              <div className="analysis-summary">
                <h3 className="analysis-subtitle">요약</h3>
                <p className="analysis-summary-text">
                  {analysis.summary || '요약 결과가 없습니다.'}
                </p>
              </div>

              {/* 감정 + 트렌드 */}
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

              {/* 키워드 */}
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

              {/* 분석 완료 시각 */}
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