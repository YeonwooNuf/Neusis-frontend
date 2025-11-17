// src/pages/ProfilePage.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserStats } from '../types/user';
import PageContainer from '../components/PageContainer';
import './ProfilePage.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 통계 정보 상태
  const [stats, setStats] = useState<UserStats>({
    articlesRead: 0,   // TODO: 읽은 기사 수 API 붙이면 교체
    savedArticles: 0,  // 좋아요(북마크) 수
    readingTime: '-',  // TODO: 읽은 시간 계산 붙이면 교체
  });
  const [loading, setLoading] = useState(true);

  // 유저가 없으면 로그인 페이지로 이동
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // 임시 즐겨찾는 카테고리 (나중에 API 붙일 수 있음)
  const favoriteCategories = ['Technology', 'Science', 'Finance'];

  // 프로필 통계 API 호출
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // 1) 좋아요(북마크) 개수
        // GET /api/users/{userId}/likes/count  -> number 반환 가정
        const likeRes = await fetch(
          `${API_BASE_URL}/users/${user.id}/likes/count`,
          { credentials: 'include' },
        );

        let savedArticles = 0;
        if (likeRes.ok) {
          savedArticles = await likeRes.json(); // number
        }

        // 2) 추후 articlesRead, readingTime 도 API 붙이면 여기에서 함께 세팅
        setStats({
          articlesRead: 0,     // TODO: 읽은 기사 수 API 만들면 교체
          savedArticles,       // 백엔드에서 가져온 좋아요 수
          readingTime: '-',    // TODO: 읽은 시간 계산 붙이면 교체
        });
      } catch (e) {
        console.error('프로필 통계 조회 실패', e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // 아직 user 정보도 없으면 바로 렌더링 중단
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="profile-page">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <span className="avatar-initial">
                  {getInitials(user.nickname)}
                </span>
              </div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{user.nickname}</h1>
              <p className="profile-email">{user.email}</p>
              <p className="profile-role">{user.role}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-value">-</div>
              <div className="stat-label">Articles Read</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">-</div>
              <div className="stat-label">Saved Articles</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">-</div>
              <div className="stat-label">Total Reading Time</div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="profile-page">
        {/* 헤더 영역: 아바타 + 기본 정보 */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-initial">
                {getInitials(user.nickname)}
              </span>
            </div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.nickname}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">{user.role}</p>
          </div>
        </div>

        {/* 간단 통계 카드 */}
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.articlesRead}</div>
            <div className="stat-label">Articles Read</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.savedArticles}</div>
            <div className="stat-label">Saved Articles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.readingTime}</div>
            <div className="stat-label">Total Reading Time</div>
          </div>
        </div>

        {/* 하단 섹션들 */}
        <div className="profile-sections">
          {/* 즐겨찾는 카테고리 (지금은 Mock) */}
          <section className="profile-section">
            <h2 className="section-title">Favorite Categories</h2>
            <div className="categories-list">
              {favoriteCategories.map((category, index) => (
                <div key={index} className="category-badge">
                  {category}
                </div>
              ))}
            </div>
          </section>

          {/* 계정 설정 (UI만 존재, 실제 기능은 추후 연동) */}
          <section className="profile-section">
            <h2 className="section-title">Account Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Email Notifications</h3>
                  <p className="setting-description">
                    Receive updates about new articles
                  </p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Dark Mode</h3>
                  <p className="setting-description">
                    Switch to dark theme
                  </p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Weekly Digest</h3>
                  <p className="setting-description">
                    Get weekly summary of top articles
                  </p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* 읽기 환경 설정 (지금은 로컬 상태 없이 단순 UI) */}
          <section className="profile-section">
            <h2 className="section-title">Reading Preferences</h2>
            <div className="preferences-list">
              <div className="preference-item">
                <span className="preference-label">Default View</span>
                <select className="preference-select" defaultValue="grid">
                  <option value="grid">Grid View</option>
                  <option value="list">List View</option>
                </select>
              </div>
              <div className="preference-item">
                <span className="preference-label">Articles per Page</span>
                <select className="preference-select" defaultValue="12">
                  <option value="6">6</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;