import React from "react";
import { AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ children, withSidebar, showSignoutIcon = true, labName, usuario, onSignout }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // <-- Adicione esta linha
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const SIDEBAR_WIDTH = 240; // largura do sidebar quando persistente
  const APPBAR_HEIGHT = 64; // ajuste se seu toolbar tiver outra altura

  // Verifica se está na tela inicial ou selecionar-lab
  const hideMenuButton = location.pathname === "/" || location.pathname === "/selecionar-lab" || location.pathname === "/implantacao";
 
  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev); // alterna entre abrir e fechar
  };
  
  const handleSignout = () => {
    if (onSignout) {
      onSignout(); 
    }
    navigate("/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingTop: sidebarOpen ? APPBAR_HEIGHT : 0 }}>
      <AppBar position={sidebarOpen ? "fixed" : "static"} style={{ width: "100%", zIndex: 1201, backgroundColor: "#01386a" }}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Só mostra o botão se não estiver nas rotas ocultas */}
            {!hideMenuButton && (
              <IconButton color="inherit" onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
            )}
            <img
              src="/SPQC.png"
              alt="SPQC"
              style={{ height: 40, marginLeft: 4 }} // diminui o marginLeft
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
            {labName && (
              <Typography
                variant="subtitle1"
                style={{
                  marginLeft: 10,
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "#fff",
                }}
                title={labName}
              >
                {labName}
              </Typography>
            )}
            {usuario?.nomUsuario && (
              <Typography variant="subtitle1" style={{ marginRight: "16px", color: "#fff" }}>
                {usuario.nomUsuario}
              </Typography>
            )}
            {showSignoutIcon && (
              <IconButton color="inherit" onClick={handleSignout}>
                <ExitToAppIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Sidebar: persistente em desktop, overlay em mobile */}
      <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>
        {!isSmall ? (
          // Desktop: reservamos espaço para o sidebar quando aberto
          <div
            style={{
              width: sidebarOpen ? SIDEBAR_WIDTH : 0,
              transition: "width 240ms",
              overflow: "hidden",
              flex: "0 0 auto",
            }}
          >
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              variant="persistent"
              sx={{ width: SIDEBAR_WIDTH, marginTop: sidebarOpen ? APPBAR_HEIGHT : 0 }}
            />
          </div>
        ) : (
          // Mobile: overlay (temporário)
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            variant="temporary"
            sx={{ marginTop: APPBAR_HEIGHT }}
          />
        )}

        <div style={{ flex: 1, overflow: "auto" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Header;