import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  Divider,
} from "@mui/material";
import {
  Home,
  Settings,
  Inventory,
  SwapHoriz,
  AddBox,
  PostAdd,
  Assessment,
  People,
  TableChart,
  Business,
  Store,
  Close,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = ({ open, onClose, sx }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClearLabAndNavigate = () => {
    localStorage.removeItem("labId");
    localStorage.removeItem("labName");
  };

  return (
    <Drawer
      variant={isSmall ? "temporary" : "permanent"}
      open={isSmall ? open : true}
      onClose={isSmall ? onClose : undefined}
      ModalProps={{
        keepMounted: true, // Melhor performance mobile
      }}
      sx={{
        ...sx,
        width: isSmall ? 200 : 240,
        flexShrink: 0,
        position: isSmall ? "absolute" : "fixed",
        left: 0,
        height: "100vh",
        [`& .MuiDrawer-paper`]: {
          width: isSmall ? 200 : 240,
          boxSizing: "border-box",
          height: "100%",
          paddingTop: "60px",
        },
      }}
    >
      {isSmall && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
          }}
        >
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      )}
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
            <TableChart />
          </ListItemIcon>
          <ListItemText primary="Produtos" />
        </ListItem>
        <ListItem component={Link} to="/campus">
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText primary="Campus" />
        </ListItem>
        <ListItem component={Link} to="/unidadeorganizacional">
          <ListItemIcon>
            <Assessment />
          </ListItemIcon>
          <ListItemText primary="Unidades" />
        </ListItem>
        <ListItem component={Link} to="/localestocagem">
          <ListItemIcon>
            <Store />
          </ListItemIcon>
          <ListItemText primary="Locais de Estocagem" />
        </ListItem>
        <ListItem component={Link} to="/usuarios">
          <ListItemIcon>
            <People />
          </ListItemIcon>
          <ListItemText primary="Usuários" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;