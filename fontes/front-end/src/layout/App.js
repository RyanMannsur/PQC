import { useContext, useEffect } from "react";
import Header from "../components/Header";
import { AuthContext } from "../contexts/auth"; 
import { useLocal } from "../contexts/local"; 
import { obterNomeLocalEstocagem } from "../services/produto/service";

const AppLayout = ({ children }) => {
const { usuario } = useContext(AuthContext);
const { labId, labName, setLabName } = useLocal(); 

useEffect(() => {
  const fetchLabDetails = async () => {
    if (labId) {
      const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
      try {
        const labDetails = await obterNomeLocalEstocagem(
          codCampus,
          codUnidade,
          codPredio,
          codLaboratorio
        );
        if (labDetails && labDetails.length > 0) {
          setLabName(labDetails[0].nomLocal); 
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do laboratório:", error);
      }
    }
  };

  fetchLabDetails();
}, [labId, setLabName]);

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