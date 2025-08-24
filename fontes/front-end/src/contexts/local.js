import { createContext, useState } from "react";
import authService from '../services/authService'


export const LocalContext = createContext({});

export const LocalProvider = ({ children }) => {
  // O estado `usuario` agora é a única fonte de verdade.
  // Ele é inicializado com os dados do usuário do localStorage.
  const [usuario, setUsuario] = useState(() => {
    return authService.getCurrentUser();
  });

  return (
    <LocalContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </LocalContext.Provider>
  );
};

// hook personalizado
export const useLocal = () => {
  return useContext(LocalContext);
};