import PageContainer from '../components/PageContainer';
import './HomePage.css';
import {
  FiBarChart2,
  FiSearch,
  FiTrendingUp,
  FiBell,
} from 'react-icons/fi';

const HomePage = () => {
  return (
    <PageContainer>
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-inner">
            {/* 왼쪽 텍스트 영역 */}
            <div className="hero-content">
              <h1 className="hero-title">Welcome to Neusis</h1>
              <p className="hero-subtitle">
                데이터 기반 인사이트를 제공하는 뉴스 분석 플랫폼
              </p>
              <div className="hero-actions">
                <a href="/news" className="btn btn-primary">
                  뉴스 탐색하기
                </a>
                <a href="/profile" className="btn btn-secondary">
                  프로필 보기
                </a>
              </div>

              <div className="hero-metrics">
                <div className="hero-metric-item">
                  <span className="hero-metric-label">오늘 분석된 기사</span>
                  <span className="hero-metric-value">1,248+</span>
                </div>
                <div className="hero-metric-item">
                  <span className="hero-metric-label">모니터링 중인 키워드</span>
                  <span className="hero-metric-value">320</span>
                </div>
              </div>
            </div>

            {/* 오른쪽 비주얼 카드 영역 */}
            <div className="hero-visual">
              <div className="hero-card">
                <div className="hero-card-header">
                  <span className="hero-card-title">오늘의 이슈 트렌드</span>
                  <span className="hero-card-badge">Live</span>
                </div>

                <div className="hero-card-chart">
                  <div className="hero-bar-group">
                    <div className="hero-bar-label">경제</div>
                    <div className="hero-bar hero-bar--1" />
                    <span className="hero-bar-value">42%</span>
                  </div>
                  <div className="hero-bar-group">
                    <div className="hero-bar-label">정치</div>
                    <div className="hero-bar hero-bar--2" />
                    <span className="hero-bar-value">28%</span>
                  </div>
                  <div className="hero-bar-group">
                    <div className="hero-bar-label">IT/과학</div>
                    <div className="hero-bar hero-bar--3" />
                    <span className="hero-bar-value">18%</span>
                  </div>
                  <div className="hero-bar-group">
                    <div className="hero-bar-label">사회</div>
                    <div className="hero-bar hero-bar--4" />
                    <span className="hero-bar-value">12%</span>
                  </div>
                </div>

                <div className="hero-card-footer">
                  지난 24시간 기준 · 실시간 뉴스 데이터 기반
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">주요 기능</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon--blue">
                <FiBarChart2 className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">분석 대시보드</h3>
              <p className="feature-description">
                뉴스 동향을 추적하고 시각화된 데이터로 패턴을 분석할 수 있습니다
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--purple">
                <FiSearch className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">스마트 검색</h3>
              <p className="feature-description">
                고급 필터링과 검색 기능으로 원하는 뉴스를 빠르게 찾을 수 있습니다
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--green">
                <FiTrendingUp className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">트렌드 분석</h3>
              <p className="feature-description">
                최신 이슈의 흐름을 파악하고 뉴스 보도의 패턴을 인사이트로 제공합니다
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--orange">
                <FiBell className="feature-icon-svg" />
              </div>
              <h3 className="feature-title">실시간 업데이트</h3>
              <p className="feature-description">
                실시간 뉴스 업데이트와 맞춤형 알림으로 필요한 정보를 바로 확인하세요
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default HomePage;