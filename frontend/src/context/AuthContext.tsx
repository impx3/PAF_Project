import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import api from "../utils/axiosConfig";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase.config.ts";

export interface Following {
  id: number;
  username: string;
}

export interface User {
  followers: number;
  totalPosts: number;
  bio: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage: string;
  isVerified: boolean;
  coins: number;
  following: Following[];
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  loading: boolean;
  firebaseLogin: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Save to localStorage helper
  const saveUserToLocalStorage = (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  const firebaseLogin = async () => {
    // 1. Sign in with Google popup
    const result = await signInWithPopup(auth, googleProvider);
    // 2. Get the ID token from Firebase
    const idToken = await result.user.getIdToken();
    // 3. Exchange it at your backend
    const res = await api.post(
      "/auth/firebase-login",
      {},
      { headers: { Authorization: `Bearer ${idToken}` } },
    );
    if (res.data?.result.token) {
      // 4. Persist *your* JWT + user profile
      localStorage.setItem("token", res.data.result.token);
      setCurrentUser(res.data.result);
      saveUserToLocalStorage(res.data.result);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        loading,
        firebaseLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
