import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "../pages/Signin";
import SelecionarLocal from "../pages/SelecionarLocal";
import Home from "../pages/Home";
import Inventario from "../pages/Inventario";
import TransferirProduto from "../pages/Transferencia/tranferirProduto";
import CreateProdutos from "../pages/createProduto";
import PrivateRoute from "./private";
import AppNotSidebar from "../layout/AppNotSidebar";
import AppLayout from "../layout/App";
import PublicoLayout from "../layout/publico";
import Traferencia from "../pages/Transferencia";
import Implantacao from "../pages/implantacao";
import ConsultaPQCPage from "../pages/consultaPQC";
import ProdutoPage from "../pages/produto";
import CampusPage from "../pages/campus";
import UnidadePage from "../pages/unidadeorganizacional";
import LocalEstocagemPage from "../pages/localestocagem";
import UsuariosPage from "../pages/usuario";

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
        <Route
          path="/cadastrar-produto"
          element={
            <PrivateRoute>
              <AppLayout>
                <CreateProdutos />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/implantacao"
          element={
            <PrivateRoute>
              <AppNotSidebar>
                <Implantacao />
              </AppNotSidebar>
            </PrivateRoute>
          }
        />
        <Route
          path="/implantar/novos-produtos"
          element={
            <PrivateRoute>
              <AppLayout>
                <Implantacao />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/produto"
          element={
            <PrivateRoute>
              <AppLayout>
                <ProdutoPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/campus"
          element={
            <PrivateRoute>
              <AppLayout>
                <CampusPage />
              </AppLayout>
            </PrivateRoute>
          }
        />


        <Route
          path="/unidadeorganizacional"
          element={
            <PrivateRoute>
              <AppLayout>
                <UnidadePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/ConsultaPQC"
          element={
            <PrivateRoute>
              <AppLayout>
                <ConsultaPQCPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/localestocagem"
          element={
            <PrivateRoute>
              <AppLayout>
                <LocalEstocagemPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <AppLayout>
                <UsuariosPage />
              </AppLayout>
            </PrivateRoute>
          }
        />

      </Routes>
      
    </Router>
  );
};

export default RoutesApp;
