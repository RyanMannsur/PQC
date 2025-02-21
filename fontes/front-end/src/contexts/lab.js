import React, { createContext, useState, useContext, useEffect } from "react";

const LabContext = createContext();

export const LabProvider = ({ children }) => {
  const [labId, setLabId] = useState(null);

  // Efeito para carregar o labId do localStorage quando a aplicação iniciar
  useEffect(() => {
    const storedLabId = localStorage.getItem("labId");
    if (storedLabId) {
      setLabId(storedLabId);
    }
  }, []);

  // Atualiza o labId no contexto e também no localStorage
  const handleSetLabId = (id) => {
    setLabId(id);
    localStorage.setItem("labId", id); // Salvando no localStorage
  };

  return (
    <LabContext.Provider value={{ labId, setLabId: handleSetLabId }}>
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => {
  return useContext(LabContext);
};
