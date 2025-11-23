import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../contexts/AuthContext';
import { ArticleDto } from '../types/article';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const SavedArticlesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSavedArticles = async () => {
      try {
        // ⚠️ 실제 백엔드 엔드포인트에 맞게 수정
        const res = await fetch(
          `${API_BASE_URL}/users/${user.id}/likes/articles`,
          { credentials: 'include' }
        );

        if (!res.ok) {
          throw new Error('저장한 기사 목록 조회 실패');
        }

        // 단순 배열인 경우
        const data: ArticleDto[] = await res.json();

        // PageResponse<ArticleDto> 형태인 경우라면:
        // const page: PageResponse<ArticleDto> = await res.json();
        // setArticles(page.content);

        setArticles(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <PageContainer>
      <div className="saved-articles-page">
        <div className="saved-articles-header">
          <h1>저장한 기사</h1>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← 프로필로 돌아가기
          </button>
        </div>

        {loading ? (
          <p>저장한 기사를 불러오는 중입니다...</p>
        ) : articles.length === 0 ? (
          <p>저장한 기사가 없습니다.</p>
        ) : (
          <ul className="saved-articles-list">
            {articles.map((article) => (
              <li key={article.articleId} className="saved-article-item">
                {/* 썸네일 */}
                {article.imageUrl && (
                  <div className="saved-article-thumbnail">
                    <img src={article.imageUrl} alt={article.title} />
                  </div>
                )}

                <div className="saved-article-body">
                  <h2 className="saved-article-title">{article.title}</h2>

                  {/* 요약/내용 일부 보여주고 싶으면 content 슬라이스 */}
                  {article.content && (
                    <p className="saved-article-summary">
                      {article.content.length > 120
                        ? article.content.slice(0, 120) + '...'
                        : article.content}
                    </p>
                  )}

                  <div className="saved-article-meta">
                    {article.source && (
                      <span className="saved-article-source">
                        {article.source}
                      </span>
                    )}
                    {article.publishedAt && (
                      <span className="saved-article-date">
                        {article.publishedAt}
                      </span>
                    )}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="saved-article-link"
                    >
                      원문 보기
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  );
};

export default SavedArticlesPage;