// src/contexts/auth.js
import { createContext, useEffect, useState } from "react";
import authService from '../services/authService';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const usuario = authService.getCurrentUser();
      
      if (usuario) {
        setUsuario(usuario);
      }
      
      setLoading(false);
    }
    
    loadUser();
  }, []); 

  const signin = async (cpf) => {
    try {
      const usuario = await authService.login(cpf);
      authService.setCurrentUser(usuario);
      setUsuario(usuario);
      return null;
    } catch (error) {
      return error.message || "Erro no login";
    }
  };

  const signout = () => {
    setUsuario(null);
    authService.logout();
  };

  const alterarLaboratorio = (laboratorio) => {
    // Cria uma cópia do objeto 'usuario'
    const novoUsuario = { ...usuario };
    
    const novoIndice = novoUsuario.laboratorios.findIndex(
      (lab) =>
        lab.codCampus === laboratorio.codCampus &&
        lab.codUnidade === laboratorio.codUnidade &&
        lab.codPredio === laboratorio.codPredio &&
        lab.codLaboratorio === laboratorio.codLaboratorio
    );

    // Atualiza o índice corrente do laboratório no objeto do usuário
    if (novoIndice !== -1) {
      novoUsuario.indCorrente = novoIndice;
      setUsuario(novoUsuario); 
      authService.setCurrentUser(novoUsuario); 
      authService.alterarLaboratorioCorrente(novoUsuario)
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      usuario, 
      signin, 
      signout, 
      loading,
      alterarLaboratorio 
    }}>
      {children}
    </AuthContext.Provider>
  );
};