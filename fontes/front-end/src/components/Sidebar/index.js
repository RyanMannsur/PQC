import {
Drawer,
List,
ListItem,
ListItemText,
ListItemIcon,
} from "@mui/material";
import { Home, Settings, Inventory, SwapHoriz, AddBox, PostAdd, Assessment } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
const handleClearLabAndNavigate = () => {
  localStorage.removeItem("labId");
  localStorage.removeItem("labName");
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
      <ListItem component={Link} to="/home">
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Início" />
      </ListItem>

      <ListItem
        component={Link}
        to="/selecionar-lab"
        onClick={handleClearLabAndNavigate}
      >
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText primary="Trocar Laboratório" />
      </ListItem>

      <ListItem component={Link} to="/inventario">
        <ListItemIcon>
          <Inventory />
        </ListItemIcon>
        <ListItemText primary="Inventário" />
      </ListItem>

      <ListItem component={Link} to="/cadastrar-produto">
        <ListItemIcon>
          <PostAdd />
        </ListItemIcon>
        <ListItemText primary="Adicionar Produtos" />
      </ListItem>

      <ListItem component={Link} to="/transferencias">
        <ListItemIcon>
          <SwapHoriz />
        </ListItemIcon>
        <ListItemText primary="Transferências" />
      </ListItem>

      <ListItem component={Link} to="/implantar/novos-produtos">
        <ListItemIcon>
          <AddBox />
        </ListItemIcon>
        <ListItemText primary="Implantação" />
      </ListItem>


        <ListItem component={Link} to="/produto">
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary="Cadastrar Produto" />
        </ListItem>
        
      <ListItem component={Link} to="/campus">
        <ListItemIcon>
          <Assessment />
        </ListItemIcon>
        <ListItemText primary="Campus" />
      </ListItem>

      <ListItem component={Link} to="/unidadeorganizacional">
        <ListItemIcon>
          <Assessment />
        </ListItemIcon>
        <ListItemText primary="Unidades" />
      </ListItem>
      
      <ListItem component={Link} to="/consultaPQC">
        <ListItemIcon>
          <Assessment />
        </ListItemIcon>
        <ListItemText primary="Consulta PQC" />
      </ListItem>
    </List>
  </Drawer>
);
};

export default Sidebar;