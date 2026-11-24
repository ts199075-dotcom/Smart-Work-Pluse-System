/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { loginUser } from "../services/authService";

const AuthContext = createContext(null);

const STORAGE_KEY = "smart_workspace_auth";

const ROLE_MAPPING = {
  Admin: "admin",
  Manager: "team-leader",
  HR: "hr",
  Employee: "member",
  Finance: "finance",
};

const getUserFromToken = (token) => {
  try {
    const payload = token.split(".")[1];

    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decodedPayload = JSON.parse(
      decodeURIComponent(
        atob(normalizedPayload)
          .split("")
          .map(
            (char) =>
              "%" + char.charCodeAt(0).toString(16).padStart(2, "0")
          )
          .join("")
      )
    );

    const roleClaim =
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

    const role = decodedPayload[roleClaim];

    return {
      id: decodedPayload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ],
      name: decodedPayload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      ],
      email: decodedPayload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ],
      role: ROLE_MAPPING[role] || null,
      token,
    };
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  const user = getUserFromToken(token);

  if (!user) return false;

  try {
    const payload = JSON.parse(
      atob(
        token.split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth =
      localStorage.getItem(STORAGE_KEY) ||
      sessionStorage.getItem(STORAGE_KEY);

    if (savedAuth) {
      try {
        const { token } = JSON.parse(savedAuth);

        if (isTokenValid(token)) {
          setUser(getUserFromToken(token));
        } else {
          localStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe = false) => {
    const response = await loginUser(
      email,
      password,
      rememberMe
    );

    const loggedInUser = getUserFromToken(response.token);

    if (!loggedInUser) {
      throw new Error("Invalid authentication token");
    }

    if (!loggedInUser.role) {
      throw new Error("Your account does not have a supported role");
    }

    const storage = rememberMe ? localStorage : sessionStorage;

    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);

    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: response.token,
      })
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const value = {
    user,
    token: user?.token || null,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};