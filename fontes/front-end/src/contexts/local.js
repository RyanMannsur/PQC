import React, { createContext, useState, useContext, useEffect } from "react";

export const LocalContext = createContext({});

export const LocalProvider = ({ children }) => {
const [labId, setLabId] = useState(null);

useEffect(() => {
  const storedLocalId = localStorage.getItem("labId");
  if (storedLocalId) {
    setLabId(JSON.parse(storedLocalId));
  }
}, []);

const handleSetLabId = (id) => {
  setLabId(id);
  localStorage.setItem("labId", JSON.stringify(id));
};

return (
  <LocalContext.Provider value={{ labId, setLabId: handleSetLabId }}>
    {children}
  </LocalContext.Provider>
);
};

export const useLocal = () => {
return useContext(LocalContext);
};