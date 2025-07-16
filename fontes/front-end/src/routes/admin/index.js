import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../../services/auth/service";

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/home" />;
  }
  
  return children;
};

export default AdminRoute;
