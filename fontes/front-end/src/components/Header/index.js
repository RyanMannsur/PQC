import React from "react";
import { AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ children, withSidebar, showSignoutIcon = true, labName, usuario, onSignout }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm")); // <-- Adicione esta linha
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev); // alterna entre abrir e fechar
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSignout = () => {
    if (onSignout) {
      onSignout(); 
    }
    navigate("/");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar
        position="static"
        style={{
          width: "100%",
          zIndex: 1201,
          backgroundColor: "#01386a", // cor de fundo personalizada
        }}
      >
        <Toolbar style={{ justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {isSmall && withSidebar && (
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
      {/* Renderiza a Sidebar logo abaixo do Header em telas pequenas */}
      {isSmall && withSidebar && (
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarClose}
          sx={{ marginTop: 64 }} // Adiciona margem superior igual à altura do AppBar (normalmente 64px)
        />
      )}
      <div style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        overflow: "hidden",
      }}>
        {/* Renderiza a Sidebar na lateral apenas em telas grandes */}
        {!isSmall && withSidebar && (
          <Sidebar />
        )}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            paddingLeft: withSidebar && !isSmall ? 240 : 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Header;