import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { useAuth } from '../contexts/AuthContext';
import { ArticleDto } from '../types/article';
import BookmarkIcon from '../components/BookmarkIcon';
import './SavedArticlesPage.css';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const SavedArticlesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [articles, setArticles] = useState<ArticleDto[]>([]);
    const [loading, setLoading] = useState(true);

    const handleToggleBookmark = async (articleId: number) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(
                `${API_BASE_URL}/users/${user.id}/articles/${articleId}/like`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (!res.ok) {
                throw new Error('북마크 토글 실패');
            }

            const liked: boolean = await res.json();

            // 목록 페이지이므로: 좋아요 취소 → 목록에서 제거
            if (!liked) {
                setArticles(prev => prev.filter(a => a.articleId !== articleId));
            }
        } catch (e) {
            console.error('북마크 토글 실패', e);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchSavedArticles = async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/users/${user.id}/likes/articles`,
                    { credentials: 'include' }
                );

                if (!res.ok) {
                    throw new Error('저장한 기사 목록 조회 실패');
                }

                const data: ArticleDto[] = await res.json();

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
                            <li
                                key={article.articleId}
                                className="saved-article-item"
                                onClick={() => navigate(`/news/${article.articleId}`)}
                            >
                                <button
                                    type="button"
                                    className="saved-article-bookmark-btn"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 리스트 전체 클릭 막기
                                        handleToggleBookmark(article.articleId);
                                    }}
                                >
                                    <BookmarkIcon filled={true} />
                                </button>
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