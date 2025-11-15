import PageContainer from '../components/PageContainer';
import './HomePage.css';

const HomePage = () => {
  return (
    <PageContainer>
      <div className="home-page">
        <section className="hero-section">
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
        </section>

        <section className="features-section">
          <h2 className="section-title">주요 기능</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">분석 대시보드</h3>
              <p className="feature-description">
                뉴스 동향을 추적하고 시각화된 데이터로 패턴을 분석할 수 있습니다
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">스마트 검색</h3>
              <p className="feature-description">
                고급 필터링과 검색 기능으로 원하는 뉴스를 빠르게 찾을 수 있습니다
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">트렌드 분석</h3>
              <p className="feature-description">
                최신 이슈의 흐름을 파악하고 뉴스 보도의 패턴을 인사이트로 제공합니다
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
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