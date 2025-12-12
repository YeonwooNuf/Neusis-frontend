import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserStats } from '../types/user';
import PageContainer from '../components/PageContainer';
import CalendarModal from '../components/modals/CalendarModal';
import { useTheme } from '../contexts/ThemeContext';
import './ProfilePage.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 통계 정보 상태
  const [stats, setStats] = useState<UserStats>({
    articlesRead: 0,   // 조회한 기사 수
    savedArticles: 0,  // 좋아요(북마크) 수
    streakDays: 0,  // 연속 출석일 수
  });

  // 저장한 기사 목록 페이지로 이동
  const handleSavedArticlesClick = () => {
    navigate('/saved-articles');
  };

  // 출석 날짜 + 모달 오픈 여부
  const [showCalendar, setShowCalendar] = useState(false);
  const [readDates, setReadDates] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // 이메일 알림 설정 상태
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);

  // 주간 요약 설정 상태
  const [weeklyDigest, setWeeklyDigest] = useState<boolean>(true);

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

  // 즐겨찾는 카테고리 상태값
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);

  // 프로필 통계 API 호출
  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // 1) 읽은 기사 수
        const readRes = await fetch(
          `${API_BASE_URL}/users/${user.id}/reads/count`,
          { credentials: 'include' }
        );

        let articlesRead = 0;
        if (readRes.ok) {
          articlesRead = await readRes.json();
        }

        // 2) 좋아요(북마크) 개수
        const likeRes = await fetch(
          `${API_BASE_URL}/users/${user.id}/likes/count`,
          { credentials: 'include' },
        );

        let savedArticles = 0;
        if (likeRes.ok) {
          savedArticles = await likeRes.json();
        }

        // 3) 연속 출석 일수
        const streakRes = await fetch(
          `${API_BASE_URL}/users/${user.id}/reads/streak?days=30`,
          { credentials: 'include' }
        );

        let streakDays = 0;
        if (streakRes.ok) {
          streakDays = await streakRes.json();
        }

        // 4) 출석한 날짜 목록 (달력용)
        const datesRes = await fetch(
          `${API_BASE_URL}/users/${user.id}/reads/dates/all`,
          { credentials: 'include' }
        );

        if (datesRes.ok) {
          const dates: string[] = await datesRes.json(); // ["2025-02-01", ...]
          setReadDates(dates);
        }

        // 5) 많이 읽은 카테고리 Top 3
        // 백엔드에서 string[] 형태로 내려온다고 가정: ["Technology", "Science", "Finance"]
        const favRes = await fetch(
          `${API_BASE_URL}/users/${user.id}/reads/top-categories?limit=3`,
          { credentials: 'include' }
        );

        if (favRes.ok) {
          const categories: string[] = await favRes.json();
          setFavoriteCategories(categories);
        } else {
          setFavoriteCategories([]); // 실패 시 빈 배열
        }

        setStats({
          articlesRead,
          savedArticles,
          streakDays,
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
              <div className="stat-label">읽은 기사 수</div>
            </div>
            {/* 저장한 기사 수 → 클릭 시 이동 */}
            <div
              className="stat-card clickable"
              onClick={handleSavedArticlesClick}
            >
              <div className="stat-value">-</div>
              <div className="stat-label">저장한 기사 수</div>
            </div>
            {/* 연속 출석 + 클릭 시 달력 모달 */}
            <div
              className="stat-card clickable"
              onClick={() => setShowCalendar(true)}
            >
              <div className="stat-value">{stats.streakDays}</div>
              <div className="stat-label">연속 출석 일수</div>
            </div>
          </div>
        </div>

        {showCalendar && (
          <CalendarModal
            readDates={readDates}
            onClose={() => setShowCalendar(false)}
          />
        )}
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
            <div className="stat-label">읽은 기사 수</div>
          </div>
          {/* 저장한 기사 수 → 클릭 시 이동 */}
          <div
            className="stat-card clickable"
            onClick={handleSavedArticlesClick}
          >
            <div className="stat-value">{stats.savedArticles}</div>
            <div className="stat-label">저장한 기사 수</div>
          </div>
          {/* 연속 출석 + 클릭 시 달력 모달 */}
          <div
            className="stat-card clickable"
            onClick={() => setShowCalendar(true)}
          >
            <div className="stat-value">{stats.streakDays}</div>
            <div className="stat-label">연속 출석 일수</div>
          </div>
        </div>

        {/* 하단 섹션들 */}
        <div className="profile-sections">
          {/* 즐겨찾는 카테고리 (지금은 Mock) */}
          <section className="profile-section">
            <h2 className="section-title">Favorite Categories</h2>
            <div className="categories-list">
              {favoriteCategories.length === 0 ? (
                <p className="empty-text">아직 통계가 없어요.</p>
              ) : (
                favoriteCategories.map((category, index) => (
                  <div key={index} className="category-badge">
                    {category}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 계정 설정 (UI만 존재, 실제 기능은 추후 연동) */}
          <section className="profile-section">
            <h2 className="section-title">Account Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Switch theme</h3>
                  <p className="setting-description">페이지 테마를 전환하여보세요.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Weekly Digest</h3>
                  <p className="setting-description">
                    금주 인기 기사의 요약을 확인하여보세요.
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={weeklyDigest}
                    onChange={() =>
                      setWeeklyDigest(prev => !prev)
                    }
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Tracking Attendance</h3>
                  <p className="setting-description">
                    출석 정보를 저장하고 연속 출석 일 수를 확인하세요.
                  </p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={() =>
                      setEmailNotifications(prev => !prev)
                    }
                  />
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

      {showCalendar && (
        <CalendarModal
          readDates={readDates}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </PageContainer>
  );
};

export default ProfilePage;