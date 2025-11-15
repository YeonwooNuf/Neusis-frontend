import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';

interface User {
  id: string;      // 프론트에서 쓸 id
  nickname: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (nickname: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 백엔드 API 베이스 URL (Vite 환경변수 사용)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ============================
  // 로그인
  // ============================
  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 세션 쿠키 받기
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // 백엔드에서 에러 메시지 내려주면 읽어서 던져도 됨
      throw new Error('로그인에 실패했습니다.');
    }

    const data: {
      userId: number;
      email: string;
      nickname: string;
      role: string;
    } = await res.json();

    const mappedUser: User = {
      id: String(data.userId),
      nickname: data.nickname,
      email: data.email,
      role: data.role,
    };

    setUser(mappedUser);
    localStorage.setItem('user', JSON.stringify(mappedUser));
  }, []);

  // ============================
  // 회원가입 (가입 성공 후 자동 로그인)
  // ============================
  const signup = useCallback(
    async (nickname: string, email: string, password: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          nickname: nickname, // 백엔드 DTO 필드명과 맞추기
        }),
      });

      if (!res.ok) {
        if (res.status === 400 || res.status === 409) {
          // 이미 존재하는 이메일 등
          throw new Error('이미 가입된 이메일입니다.');
        }
        throw new Error('회원가입에 실패했습니다.');
      }

      // 회원가입 성공 후 자동 로그인
      await login(email, password);
    },
    [login],
  );

  // ============================
  // 로그아웃
  // ============================
  const logout = useCallback(async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    setUser(null);
    localStorage.removeItem('user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};