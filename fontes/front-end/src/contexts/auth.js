import { createContext, useEffect, useState } from "react";
import { validateToken, getCurrentUser, logout, login } from "../services/auth/service";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser();
      if (user && user.token) {
        try {
          const validatedUser = await validateToken(user.token);
          setUsuario(validatedUser);
        } catch (error) {
          console.error("Token inválido:", error);
          logout();
          setUsuario(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signin = async (cpf, senha) => {
    try {
      const result = await login(cpf, senha);
      setUsuario(result);
      return null;
    } catch (error) {
      return error.message || "Erro no login";
    }
  };

  const signout = () => {
    setUsuario(null);
    logout();
  };

  return (
    <AuthContext.Provider value={{ usuario, signin, signout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
