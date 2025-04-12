import React, { useContext } from "react";
import Header from "../components/Header";
import { AuthContext } from "../contexts/auth"; 

const AppNotSidebar = ({ children }) => {
const { usuario } = useContext(AuthContext); 

return (
  <Header
    withSidebar={false}
    showSignoutIcon={true}
    usuario={usuario}
  >
    {children}
  </Header>
);
};

export default AppNotSidebar;