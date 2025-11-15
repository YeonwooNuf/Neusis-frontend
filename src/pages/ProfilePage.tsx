import PageContainer from '../components/PageContainer';
import './ProfilePage.css';

const ProfilePage = () => {
  const userStats = {
    articlesRead: 127,
    favoriteCategories: ['Technology', 'Science', 'Finance'],
    savedArticles: 23,
    readingTime: '45 hours'
  };

  return (
    <PageContainer>
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-initial">JD</span>
            </div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">John Doe</h1>
            <p className="profile-email">john.doe@example.com</p>
            <p className="profile-role">News Analyst</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-value">{userStats.articlesRead}</div>
            <div className="stat-label">Articles Read</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{userStats.savedArticles}</div>
            <div className="stat-label">Saved Articles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{userStats.readingTime}</div>
            <div className="stat-label">Total Reading Time</div>
          </div>
        </div>

        <div className="profile-sections">
          <section className="profile-section">
            <h2 className="section-title">Favorite Categories</h2>
            <div className="categories-list">
              {userStats.favoriteCategories.map((category, index) => (
                <div key={index} className="category-badge">
                  {category}
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h2 className="section-title">Account Settings</h2>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Email Notifications</h3>
                  <p className="setting-description">Receive updates about new articles</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Dark Mode</h3>
                  <p className="setting-description">Switch to dark theme</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h3 className="setting-name">Weekly Digest</h3>
                  <p className="setting-description">Get weekly summary of top articles</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </section>

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

