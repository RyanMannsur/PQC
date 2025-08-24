import {
Drawer,
List,
ListItem,
ListItemText,
ListItemIcon,
} from "@mui/material";
import { Home, Settings, Inventory, SwapHoriz, AddBox, PostAdd, FileUpload, LocalPolice, Assessment, People, TableChart, Business, Store } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

const Sidebar = () => {
  const { usuario } = useContext(AuthContext);
  const idtTipoUsuario = usuario?.idtTipoUsuario;

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

        {idtTipoUsuario === "A" && (
          <>
            <ListItem component={Link} to="/usuarios">
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary="Usuário" />
            </ListItem>
          </>
        )}
        
        {idtTipoUsuario === "A" && (
          <>
            <ListItem component={Link} to="/campus">
              <ListItemIcon>
                <Business />
              </ListItemIcon>
              <ListItemText primary="Campus" />
            </ListItem>
          </>
        )}

        {idtTipoUsuario === "A" && (
          <>
            <ListItem component={Link} to="/unidadeorganizacional">
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary="Unidade Organizacional" />
            </ListItem>
          </>
        )}

        {idtTipoUsuario === "A" && (
          <>
            <ListItem component={Link} to="/localestocagem">
              <ListItemIcon>
                <Store />
              </ListItemIcon>
              <ListItemText primary="Local de Estocagem" />
            </ListItem>
          </>
        )}

        {idtTipoUsuario === "A" && (
          <>
            <ListItem component={Link} to="/orgaoControle">
              <ListItemIcon>
                <LocalPolice />
              </ListItemIcon>
              <ListItemText primary="Orgãos Controle" />
            </ListItem>
          </>
        )}

        {idtTipoUsuario === "A" && (
          <>
          <ListItem component={Link} to="/produto">
            <ListItemIcon>
              <TableChart />
            </ListItemIcon>
            <ListItemText primary="Produtos" />
          </ListItem>
         </> 
        )}
        
        <ListItem component={Link} to="/ConsultaPQC">
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Consultar Estoque" />
        </ListItem>
            
        <ListItem component={Link} to="/cadastrar-produto">
          <ListItemIcon>
            <PostAdd />
          </ListItemIcon>
          <ListItemText primary="Entrada Produto sem NFe" />
        </ListItem>
            
        <ListItem component={Link} to="/ImportarNFe">
          <ListItemIcon>
            <FileUpload />
          </ListItemIcon>
          <ListItemText primary="Importar NFe" />
        </ListItem>
                
        <ListItem component={Link} to="/implantar/novos-produtos">
          <ListItemIcon>
            <AddBox />
          </ListItemIcon>
          <ListItemText primary="Implantação" />
        </ListItem>

        <ListItem component={Link} to="/inventario">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText primary="Inventário" />
        </ListItem>

        <ListItem component={Link} to="/transferencias">
          <ListItemIcon>
            <SwapHoriz />
          </ListItemIcon>
          <ListItemText primary="Transferência" />
        </ListItem>
               
      </List>
    </Drawer>
  );
};

export default Sidebar;