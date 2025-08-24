import { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Sidebar from "../Sidebar";
import { AuthContext } from "../../contexts/auth";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ children, withSidebar, showSignoutIcon = true, onSignout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, loading, alterarLaboratorio, signout } = useContext(AuthContext); 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLab = (laboratorio) => {
    alterarLaboratorio(laboratorio);
    handleClose();
  };

  const handleSignout = () => {
    signout(); 
    if (onSignout) {
      onSignout();
    }
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <AppBar position="fixed" style={{ width: "100%", zIndex: 1201 }}>
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="subtitle1">
            CEFETMG - Sistema dos Produtos Químicos Controlados
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginRight: "16px" }}>
              {usuario && usuario.laboratorios.length > 1 ? (
                <>
                  <Button
                    color="inherit"
                    onClick={handleClick}
                    aria-controls={open ? 'lab-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    disabled={location.pathname !== '/home'}
                  >
                    {usuario.laboratorios[usuario.indCorrente].nomLocal}
                  </Button>
                  <Menu
                    id="lab-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                  >
                    {usuario.laboratorios.map((lab, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleSelectLab(lab)}
                        selected={index === usuario.indCorrente}
                      >
                        {lab.nomLocal}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : (
                usuario && (
                  <Typography
                    variant="subtitle1"
                    style={{ lineHeight: 1 }}
                  >
                    {usuario.laboratorios[usuario.indCorrente].nomLocal}
                  </Typography>
                )
              )}
              {usuario?.nomUsuario && (
                <Typography variant="subtitle1" style={{ lineHeight: 1 }}>
                  {usuario.nomUsuario}
                </Typography>
              )}
            </div>

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
            paddingLeft: withSidebar ? 240 : 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Header;