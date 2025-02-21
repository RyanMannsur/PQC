import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const Header = ({ children, withSidebar, showSignoutIcon = true }) => {
  const { usuario, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    signout();
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <AppBar position="fixed" style={{ width: "100%" }}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6">
            PQC - Sistema dos Produtos Quimicos Controlados
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="subtitle1" style={{ marginRight: "16px" }}>
              {usuario?.nomUsuario}
            </Typography>
            {showSignoutIcon && (
              <IconButton color="inherit" onClick={handleSignout}>
                <ExitToAppIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          marginTop: "64px",
          overflow: "hidden",
        }}
      >
        {withSidebar && <Sidebar />}
        <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
      </div>
    </div>
  );
};

export default Header;
