import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { usuario } = useAuth();

  return usuario ? children : <Navigate to="/" />;
};

export default PrivateRoute;
