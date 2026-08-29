import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Get saved data immediately when app starts
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid saved user:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // ============================================
  // RESTORE LOGIN WHEN APP STARTS
  // ============================================

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      // No token = not logged in
      if (!savedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      // Restore saved user immediately
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Invalid saved user:", error);
        }
      }

      try {
        // Verify token with backend
        const data = await getCurrentUser();

        const currentUser = data?.user || data;

        if (currentUser) {
          setUser(currentUser);

          localStorage.setItem(
            "user",
            JSON.stringify(currentUser)
          );
        }

        setToken(savedToken);
      } catch (error) {
        console.error(
          "Could not verify current user:",
          error
        );

        /*
         * IMPORTANT:
         *
         * Do NOT immediately remove the token here.
         *
         * The saved login should remain available.
         *
         * Only remove token when logout is clicked
         * or when backend explicitly says token is invalid.
         */

        setToken(savedToken);

        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.error("Could not restore user:", e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ============================================
  // LOGIN
  // ============================================

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    console.log("LOGIN RESPONSE:", data);

    if (!data?.token) {
      throw new Error(
        "Login successful but token was not received."
      );
    }

    const loggedInUser = data.user || {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };

    // Save token permanently
    localStorage.setItem(
      "token",
      data.token
    );

    // Save user permanently
    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    // Update React state
    setToken(data.token);
    setUser(loggedInUser);

    return data;
  };

  // ============================================
  // REGISTER
  // ============================================

  const register = async (userData) => {
    const data = await registerUser(userData);

    console.log("REGISTER RESPONSE:", data);

    if (!data?.token) {
      throw new Error(
        "Account created, but token was not received from server."
      );
    }

    const registeredUser = data.user || {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role || userData.role,
    };

    // Save token
    localStorage.setItem(
      "token",
      data.token
    );

    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(registeredUser)
    );

    // Update state
    setToken(data.token);
    setUser(registeredUser);

    return data;
  };

  // ============================================
  // LOGOUT
  // ============================================

  const logout = () => {
    // Remove login information
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear React state
    setToken(null);
    setUser(null);
  };

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// useAuth HOOK
// ============================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

