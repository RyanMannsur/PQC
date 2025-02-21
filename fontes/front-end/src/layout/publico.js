import React from "react";
import Header from "../components/Header";

const PublicoLayout = ({ children }) => {
  return (
    <Header withSidebar={false} showSignoutIcon={false}>
      {children}
    </Header>
  );
};

export default PublicoLayout;
