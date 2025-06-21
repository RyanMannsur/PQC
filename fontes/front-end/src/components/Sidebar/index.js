import {
Drawer,
List,
ListItem,
ListItemText,
ListItemIcon,
useMediaQuery,
} from "@mui/material";
import {
Home,
Settings,
Inventory,
SwapHoriz,
AddBox,
PostAdd,
Assessment,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
const handleClearLabAndNavigate = () => {
  localStorage.removeItem("labId");
};

const isSmallScreen = useMediaQuery("(max-width: 980px)");

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
        width: isSmallScreen ? 80 : 240,
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
        {!isSmallScreen && <ListItemText primary="Início" />}
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
        {!isSmallScreen && <ListItemText primary="Trocar Laboratório" />}
      </ListItem>

      <ListItem button component={Link} to="/inventario">
        <ListItemIcon>
          <Inventory />
        </ListItemIcon>
        {!isSmallScreen && <ListItemText primary="Inventário" />}
      </ListItem>

      <ListItem button component={Link} to="/cadastrar-produto">
        <ListItemIcon>
          <PostAdd />
        </ListItemIcon>
        {!isSmallScreen && <ListItemText primary="Adicionar Produtos" />}
      </ListItem>

      <ListItem button component={Link} to="/transferencias">
        <ListItemIcon>
          <SwapHoriz />
        </ListItemIcon>
        {!isSmallScreen && <ListItemText primary="Transferências" />}
      </ListItem>

      <ListItem button component={Link} to="/implantar/novos-produtos">
        <ListItemIcon>
          <AddBox />
        </ListItemIcon>
        {!isSmallScreen && <ListItemText primary="Implantação" />}
      </ListItem>

      <ListItem button component={Link} to="/relatorio">
        <ListItemIcon>
          <Assessment />
        </ListItemIcon>
        {!isSmallScreen && <ListItemText primary="Relatório" />}
      </ListItem>
    </List>
  </Drawer>
);
};

export default Sidebar;