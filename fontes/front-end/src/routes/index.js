import ManualPage from "../pages/manual";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout"
import Signin from "../pages/Signin";
import Home from "../pages/Home";
import Inventario from "../pages/Inventario";
import CreateProdutos from "../pages/createProduto";
import PrivateRoute from "./private";
import AppNotSidebar from "../layout/AppNotSidebar";
import PublicoLayout from "../layout/publico";
import Transferencia from "../pages/Transferencia";
import Implantacao from "../pages/implantacao";
import ConsultaPQCPage from "../pages/consultaPQC";
import ProdutoPage from "../pages/produto";
import ImportarNFe from "../pages/ImportarNFe"
import CampusPage from "../pages/campus";
import UnidadeOrganizacionalPage from "../pages/unidadeOrganizacional";
import LocalEstocagemPage from "../pages/localEstocagem";
import UsuariosPage from "../pages/usuario";
import OrgaoControlePage from '../pages/orgaoControle';

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
          path="/manual"
          element={
            <PublicoLayout>
              <ManualPage />
            </PublicoLayout>
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
                <Transferencia />
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
          path="/ImportarNFe"
          element={
            <PrivateRoute>
              <AppLayout>
                <ImportarNFe />
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
                <UnidadeOrganizacionalPage />
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

        <Route
          path="/orgaoControle"
          element={
            <PrivateRoute>
              <AppLayout>
                <OrgaoControlePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

      </Routes>
      
    </Router>
  );
};

export default RoutesApp;
