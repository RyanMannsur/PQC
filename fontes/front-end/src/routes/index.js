import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signin from "../pages/Signin";
import SelecionarLab from "../pages/SelecionarLab";
import Home from "../pages/Home";
import PrivateRoute from "./private";
import AppNotSidebar from "../layout/AppNotSidebar";
import AppLayout from "../layout/App";
import useAuth from "../hooks/useAuth";
import PublicoLayout from "../layout/publico";

const RoutesApp = () => {
  const { usuario } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicoLayout>
              {usuario ? <Navigate to="/selecionar-lab" /> : <Signin />}
            </PublicoLayout>
          }
        />
        <Route
          path="/selecionar-lab"
          element={
            <PrivateRoute>
              <AppNotSidebar>
                <SelecionarLab />
              </AppNotSidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/laboratorio/:id"
          element={
            <PrivateRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default RoutesApp;
