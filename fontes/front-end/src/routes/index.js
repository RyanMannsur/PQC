import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "../pages/Signin";
import SelecionarLocal from "../pages/SelecionarLocal";
import Home from "../pages/Home";
import Inventario from "../pages/Inventario";
import InventarioDetalhes from "../pages/Inventario/updateInventario";
import TransferirProduto from "../pages/Transferencia/tranferirProduto";
import PrivateRoute from "./private";
import AppNotSidebar from "../layout/AppNotSidebar";
import AppLayout from "../layout/App";
import PublicoLayout from "../layout/publico";
import Traferencia from "../pages/Transferencia";

const RoutesApp = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicoLayout>
              <Signin />
            </PublicoLayout>
          }
        />

        <Route
          path="/selecionar-lab"
          element={
            <PrivateRoute>
              <AppNotSidebar>
                <SelecionarLocal />
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
          path="/inventario/:codProduto/:seqItem"
          element={
            <PrivateRoute>
              <AppLayout>
                <InventarioDetalhes />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/transferencias"
          element={
            <PrivateRoute>
              <AppLayout>
                <Traferencia />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/transferir/:codProduto/:seqItem"
          element={
            <PrivateRoute>
              <AppLayout>
                <TransferirProduto />
              </AppLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default RoutesApp;
