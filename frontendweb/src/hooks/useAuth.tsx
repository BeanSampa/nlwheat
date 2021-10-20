import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { api } from "../services/api";

type AuthProviderProps = PropsWithChildren<{}>;
type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}
type AuthContextData = {
  user: User | null;
  isSigningIn: boolean;
  signInUrl: string;
  signOut: () => Promise<void>;
}
type AuthResponse = {
  token: string;
  user: {
    id: string; 
    avatar_url: string;
    name: string;
    login: string;
  }
}
type ProfileResponse = AuthResponse['user']

const AuthContext = createContext({} as AuthContextData);
const isDevMode = import.meta.env.DEV;
const clientId = isDevMode ? '911e56cc28517c2e7fa3' : import.meta.env.VITE_GITHUB_CLIENT_ID;
const redirectUri = isDevMode ? 'http://localhost:3000' :import.meta.env.VITE_GITHUB_CALLBACK_URL;
const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${clientId}&redirect_uri=${redirectUri}`
  
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [isSigningIn, setIsSigningIn] = useState(false);

  async function signIn(code: string) {
    try {
      const response = await api.post<AuthResponse>('/authenticate', {
        code
      });

      const { token, user } = response.data;
      
      localStorage.setItem('@dowhile:token', token)
      api.defaults.headers.common.authorization = `Bearer ${token}`
      setUser(user);
      setIsSigningIn(true);
    } catch (err) {
      signOut();
    }
  }

  async function signOut() {
    setUser(null)
    setIsSigningIn(false);
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');
    
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`

      api.get<ProfileResponse>('/profile')
        .then(response => {
          setIsSigningIn(true);
          setUser(response.data);
        })
        .catch(() => {
          signOut();
        });
    }
  }, [])

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCallbackCode = url.includes("?code=");
    if (hasGithubCallbackCode) {
      const [urlWithoutCode, githubAuthCode] = url.split("?code=");
      window.history.pushState({}, '', urlWithoutCode);
      signIn(githubAuthCode);
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isSigningIn, signInUrl, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}