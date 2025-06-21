import { AppBar, Toolbar, Typography, IconButton, useMediaQuery } from "@mui/material";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

const Header = ({ children, withSidebar, showSignoutIcon = true, labName, usuario, onSignout }) => {
const navigate = useNavigate();
const { signout } = useContext(AuthContext); 

const isSmallScreen = useMediaQuery("(max-width: 980px)");

const sidebarWidth = withSidebar ? (isSmallScreen ? 80 : 240) : 0;

const handleSignout = () => {
  if (onSignout) {
    signout(); 
    onSignout();
  } else if (signout) {
    signout(); 
  }
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
    <AppBar position="fixed" style={{ width: "100%", zIndex: 1201 }}>
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography variant="subtitle1">
          CEFETMG - Sistema dos Produtos Químicos Controlados
        </Typography>
        <div style={{ display: "flex", alignItems: "center" }}>
          {labName && (
            <Typography
              variant="subtitle1"
              style={{ marginRight: "16px" }}
            >
              {labName}
            </Typography>
          )}
          {usuario?.nomUsuario && (
            <Typography variant="subtitle1" style={{ marginRight: "16px" }}>
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

      <div
        style={{
          flex: 1,
          overflow: "auto",
          paddingLeft: sidebarWidth,
          transition: "padding-left 0.3s",
        }}
      >
        {children}
      </div>
    </div>
  </div>
);
};

export default Header;