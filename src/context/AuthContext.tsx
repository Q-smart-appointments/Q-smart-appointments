
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "customer" | "provider" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - in a real app, this would be an API call
      // For demo purposes, we'll use some hardcoded credentials
      if (email === "provider@example.com" && password === "password") {
        const userData = {
          id: "p1",
          name: "Dr. Jane Smith",
          email: "provider@example.com",
          role: "provider" as UserRole
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else if (email === "customer@example.com" && password === "password") {
        const userData = {
          id: "c1",
          name: "John Doe",
          email: "customer@example.com",
          role: "customer" as UserRole
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    role: user?.role || null
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
