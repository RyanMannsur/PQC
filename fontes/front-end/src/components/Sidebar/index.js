import React from "react";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 200,
          boxSizing: "border-box",
          height: "100%",
        },
      }}
    >
      <List>
        <ListItem button>
          <ListItemText primary="Opção 1" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Opção 2" />
        </ListItem>
        {/* Adicione mais itens conforme necessário */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
