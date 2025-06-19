import { createContext, useEffect, useState } from "react";
import { signin as signinService } from "../services/authService";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
const [usuario, setUsuario] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const storedUserToken = localStorage.getItem("user_token");
  if (storedUserToken) {
    setUsuario({ token: storedUserToken }); 
  }
  setLoading(false);
}, []);

const signin = async (cpf, senha) => {
  try {
    const resultado = await signinService(cpf, senha); 

    if (typeof resultado === "string") {
      return resultado; 
    } else {
      setUsuario(resultado); 
      return null; 
    }
  } catch (error) {
    return "Erro ao tentar fazer login"; 
  }
};

const signout = () => {
  setUsuario(null);
  localStorage.removeItem("user_token"); 
  localStorage.removeItem("labId"); 
};

return (
  <AuthContext.Provider value={{ usuario, signin, signout, loading }}>
    {children}
  </AuthContext.Provider>
);
};
