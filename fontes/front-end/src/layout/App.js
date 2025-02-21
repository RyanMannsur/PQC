import React from "react";
import Header from "../components/Header";

const AppLayout = ({ children }) => {
  return (
    <Header withSidebar={true} showSignoutIcon={true}>
      {children}
    </Header>
  );
};

export default AppLayout;
