import PageContainer from '../components/PageContainer';
import './HomePage.css';

const HomePage = () => {
  return (
    <PageContainer>
      <div className="home-page">
        <section className="hero-section">
          <h1 className="hero-title">Welcome to Neusis</h1>
          <p className="hero-subtitle">
            Your comprehensive news analytics platform for data-driven insights
          </p>
          <div className="hero-actions">
            <a href="/news" className="btn btn-primary">
              Explore News
            </a>
            <a href="/profile" className="btn btn-secondary">
              View Profile
            </a>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Analytics Dashboard</h3>
              <p className="feature-description">
                Track news trends and analyze patterns with comprehensive data visualization
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Smart Search</h3>
              <p className="feature-description">
                Find relevant news articles quickly with advanced filtering and search capabilities
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Trend Analysis</h3>
              <p className="feature-description">
                Monitor trending topics and get insights into news coverage patterns
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Real-time Updates</h3>
              <p className="feature-description">
                Stay informed with real-time news updates and personalized notifications
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
};

export default HomePage;

