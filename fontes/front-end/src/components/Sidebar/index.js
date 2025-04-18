import React from "react";
import {
Drawer,
List,
ListItem,
ListItemText,
ListItemIcon,
} from "@mui/material";
import { Home, Settings, Inventory, SwapHoriz, AddBox } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
const handleClearLabAndNavigate = () => {
  localStorage.removeItem("labId");
};

return (
  <Drawer
    variant="permanent"
    sx={{
      width: 240,
      flexShrink: 0,
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      [`& .MuiDrawer-paper`]: {
        width: 240,
        boxSizing: "border-box",
        height: "100%",
        paddingTop: "64px",
      },
    }}
  >
    <List>
      <ListItem button component={Link} to="/home">
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Início" />
      </ListItem>

      <ListItem
        button
        component={Link}
        to="/selecionar-lab"
        onClick={handleClearLabAndNavigate}
      >
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText primary="Trocar Laboratório" />
      </ListItem>

      <ListItem button component={Link} to="/inventario">
        <ListItemIcon>
          <Inventory />
        </ListItemIcon>
        <ListItemText primary="Inventário" />
      </ListItem>

      <ListItem button component={Link} to="/transferencias">
        <ListItemIcon>
          <SwapHoriz />
        </ListItemIcon>
        <ListItemText primary="Transferências" />
      </ListItem>

      <ListItem button component={Link} to="/implantacao">
        <ListItemIcon>
          <AddBox />
        </ListItemIcon>
        <ListItemText primary="Implantação" />
      </ListItem>
    </List>
  </Drawer>
);
};

export default Sidebar;