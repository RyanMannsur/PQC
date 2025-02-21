import React from "react";
import Header from "../components/Header";

const AppNotSidebar = ({ children }) => {
  return (
    <Header withSidebar={false} showSignoutIcon={true}>
      {children}
    </Header>
  );
};

export default AppNotSidebar;
