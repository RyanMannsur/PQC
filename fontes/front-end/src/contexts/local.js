import React, { createContext, useState, useContext, useEffect } from "react";

export const LocalContext = createContext({});

export const LocalProvider = ({ children }) => {
const [labId, setLabId] = useState(null);
const [labName, setLabName] = useState(null);

useEffect(() => {
  const storedLocalId = localStorage.getItem("labId");
  const storedLabName = localStorage.getItem("labName");
  if (storedLocalId) {
    setLabId(JSON.parse(storedLocalId));
  }
  if (storedLabName) {
    setLabName(storedLabName);
  }
}, []);

const handleSetLabId = (id) => {
  setLabId(id);
  localStorage.setItem("labId", JSON.stringify(id));
};

const handleSetLabName = (name) => {
  setLabName(name);
  localStorage.setItem("labName", name);
};

return (
  <LocalContext.Provider value={{ 
    labId, 
    setLabId: handleSetLabId,
    labName,
    setLabName: handleSetLabName
  }}>
    {children}
  </LocalContext.Provider>
);
};

export const useLocal = () => {
return useContext(LocalContext);
};