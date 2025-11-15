import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/PageContainer';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('이메일과 비밀번호를 입력해주세요.');
        setIsLoading(false);
        return;
      }

      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">로그인</h1>
            <p className="login-subtitle">Neusis에 오신 것을 환영합니다</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                이메일
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="login-footer">
            <p className="signup-link-text">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="signup-link">
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LoginPage;

