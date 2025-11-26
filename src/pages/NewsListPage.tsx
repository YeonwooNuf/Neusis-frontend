import { useEffect, useState } from 'react';
import PageContainer from '../components/PageContainer';
import NewsCard from '../components/NewsCard';
import './NewsListPage.css';
import type { ArticleDto, PageResponse } from '../types/article';
import { useAuth } from '../contexts/AuthContext';

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
  WORLD: 'World',
  IT: 'IT',
};

const NewsListPage = () => {
  const { user } = useAuth();

  const [filter, setFilter] = useState<string>('all');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션 기본
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const categories = ['all', ...Object.keys(categoryLabels)];

  // 날짜 필터 상태
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  // 검색어 상태
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('size', '15');
        // 필요하면 분석 상태 필터 추가
        // params.set('status', 'PENDING');

        // 로그인한 유저 id 전달 (읽음/좋아요 플래그 계산용)
        if (user?.id != null) {
          params.set('userId', String(user.id));
        }

        // 필터가 all이 아닐 때만 카테고리 파라미터 추가
        if (filter !== 'all') {
          params.set('category', filter); // 백엔드 enum 이름과 동일하다고 가정
        }

        if (fromDate) {
          params.set('from', `${fromDate}T00:00:00`);
        }
        if (toDate) {
          params.set('to', `${toDate}T23:59:59`);
        }

        if (search.trim() !== '') {
          params.set('search', search.trim());
        }

        const res = await fetch(
          `${API_BASE_URL}/articles?${params.toString()}`,
          { credentials: 'include' },
        );

        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }

        const pageData: PageResponse<ArticleDto> = await res.json();

        // ingestStatus로 추가 필터링이 필요 없다면 그대로 사용
        const filteredByStatus = pageData.content;
        // 만약 PENDING / ANALYZED만 보고싶으면 아래처럼:
        // const filteredByStatus = pageData.content.filter(
        //   (a) => a.ingestStatus === 'PENDING' || a.ingestStatus === 'ANALYZED',
        // );

        const mapped: NewsItem[] = filteredByStatus.map((a) => ({
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
        setTotalPages(pageData.totalPages); // 이 값이 이제 카테고리 기준 totalPages
      } catch (e) {
        console.error(e);
        setError('뉴스 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, filter, user?.id, fromDate, toDate, search]); // 필터, 페이지, 유저 변경 시 다시 요청

  // 서버에서 이미 카테고리 기준으로 내려주므로 추가 필터링 불필요
  const filteredNews = news;

  return (
    <PageContainer>
      <div className="news-list-page">
        <div className="news-list-header">
          <h1 className="page-title">News Articles</h1>
          <p className="page-subtitle">
            Browse and analyze articles from your Neusis dataset
          </p>
        </div>

        <div className="news-search-area">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />

          <div className="date-filters">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(0);
              }}
            />
            <span>~</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(0);
              }}
            />
          </div>
        </div>

        <div className="news-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => {
                setFilter(category);
                setPage(0); // 카테고리 바뀔 때 첫 페이지로 이동
              }}
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