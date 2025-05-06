import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import api from "../utils/axiosConfig";

export interface Following {
  id: number;
  username: string;
}

export interface User {
  followers: ReactNode;
  totalPosts: ReactNode;
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

  // Add other user fields
}

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchCurrentUser: () => Promise<void>;
  logout: () => void;
  loading: boolean;
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

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/users/me");
      setCurrentUser(res.data.result);
    } finally {
      setLoading(false);
    }
  };

  //method to save the user to local storage
  const saveUserToLocalStorage = (user: User) => {
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const loadUserFromLocalStorage = () => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      fetchCurrentUser().then();
    } else {
      setLoading(false); // Even if no token, we are done loading
    }

    loadUserFromLocalStorage();
  }, []);

  useEffect(() => {
    if (currentUser) {
      saveUserToLocalStorage(currentUser);
    } else {
      if (localStorage.getItem("token")) {
        loadUserFromLocalStorage();
      }
    }
  }, [currentUser]);

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, fetchCurrentUser, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
