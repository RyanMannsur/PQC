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
import Inventario from "../pages/Inventario";
import InventarioDetalhes from "../pages/Inventario/updateInventario";
import PrivateRoute from "./private";
import AppNotSidebar from "../layout/AppNotSidebar";
import AppLayout from "../layout/App";
import useAuth from "../hooks/useAuth";
import PublicoLayout from "../layout/publico";

const RoutesApp = () => {
  const { usuario } = useAuth();

  const labId = localStorage.getItem("labId");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicoLayout>
              {usuario ? (
                labId ? (
                  <Navigate to="/home" />
                ) : (
                  <Navigate to="/selecionar-lab" />
                )
              ) : (
                <Signin />
              )}
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
          path="/home"
          element={
            <PrivateRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/inventario"
          element={
            <PrivateRoute>
              <AppLayout>
                <Inventario />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/inventario/:idProduto"
          element={
            <PrivateRoute>
              <AppLayout>
                <InventarioDetalhes />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default RoutesApp;
