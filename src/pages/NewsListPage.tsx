import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import NewsCard from '../components/NewsCard';
import './NewsListPage.css';
import type { ArticleDto, PageResponse, Category, IngestStatus } from '../types/article';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: string;
}

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

const NewsListPage = () => {
  const [filter, setFilter] = useState<string>('all');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션 기본
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const categories = ['all', ...Object.keys(categoryLabels)];

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        // 분석 전 기사만 보고 싶으면 status=PENDING 추가
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', '15');
        // 필요하면 아래 한 줄 활성화
        // params.set('status', 'PENDING');

        const res = await fetch(
          `${API_BASE_URL}/articles?${params.toString()}`,
          { credentials: 'include' },
        );

        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }

        const pageData: PageResponse<ArticleDto> = await res.json();

        // 여기서 PENDING만 필터링하고 싶으면 이쪽에서
        const pendingOnly = pageData.content.filter(
          (a) => a.ingestStatus === 'PENDING' || 'ANALYZED',
        );

        const mapped: NewsItem[] = pendingOnly.map((a) => ({
          id: String(a.articleId),
          title: a.title,
          summary: a.content
            ? a.content.length > 150
              ? a.content.slice(0, 150) + '...'
              : a.content
            : '',
          source: a.source ?? 'Unknown',
          publishedAt: a.publishedAt ?? a.createdAt,
          category: a.category,
        }));

        setNews(mapped);
        setTotalPages(pageData.totalPages);
      } catch (e) {
        console.error(e);
        setError('뉴스 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page]);

  const filteredNews =
    filter === 'all'
      ? news
      : news.filter(
        (n) => n.category.toUpperCase() === filter.toUpperCase(),
      );

  return (
    <PageContainer>
      <div className="news-list-page">
        <div className="news-list-header">
          <h1 className="page-title">News Articles</h1>
          <p className="page-subtitle">
            Browse and analyze articles from your Neusis dataset
          </p>
        </div>

        <div className="news-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category === 'all'
                ? 'All'
                : categoryLabels[category] ?? category}
            </button>
          ))}
        </div>

        {loading && (
          <div className="no-results">
            <p>Loading...</p>
          </div>
        )}
        {error && !loading && (
          <div className="no-results">
            <p>{error}</p>
          </div>
        )}

        <div className="news-grid">
          {!loading && !error && filteredNews.length > 0 ? (
            filteredNews.map((n) => (
              <NewsCard
                key={n.id}
                id={n.id}
                title={n.title}
                summary={n.summary}
                source={n.source}
                publishedAt={n.publishedAt}
                category={categoryLabels[n.category] ?? n.category}
              />
            ))
          ) : (
            !loading &&
            !error && (
              <div className="no-results">
                <p>No news articles found for this category.</p>
              </div>
            )
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {/* Prev 버튼 */}
            <button
              className="page-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
            >
              Prev
            </button>

            {/* 페이지 숫자들 */}
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i).map((num) => (
                <button
                  key={num}
                  className={`page-number-btn ${num === page ? 'active' : ''}`}
                  onClick={() => setPage(num)}
                >
                  {num + 1}
                </button>
              ))}
            </div>

            {/* Next 버튼 */}
            <button
              className="page-btn"
              disabled={page >= totalPages - 1}
              onClick={() =>
                setPage((p) => (p + 1 < totalPages ? p + 1 : p))
              }
            >
              Next
            </button>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default NewsListPage;
