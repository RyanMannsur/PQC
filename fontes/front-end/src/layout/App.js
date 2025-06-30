import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../contexts/auth"; 
import { useLocal } from "../contexts/local"; 
import { getProdutosImplantar } from "../services/laboratorio/service";

const AppLayout = ({ children }) => {
const { usuario } = useContext(AuthContext);
const { labId } = useLocal(); 
const [labName, setLabName] = useState(null); 

useEffect(() => {
  const fetchLabDetails = async () => {
    if (labId) {
      const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
      try {
        const labDetails = await getProdutosImplantar(
          codCampus,
          codUnidade,
          codPredio,
          codLaboratorio
        );
        setLabName(labDetails[0].nomLocal); 
      } catch (error) {
        console.error("Erro ao buscar detalhes do laboratório:", error);
      }
    }
  };

  fetchLabDetails();
}, [labId]);

return (
  <Header
    withSidebar={true}
    showSignoutIcon={true}
    usuario={usuario}
    labName={labName}
  >
    {children}
  </Header>
);
};

export default AppLayout;