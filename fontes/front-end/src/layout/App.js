import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { AuthContext } from "../contexts/auth"; // Importa o contexto de autenticação
import { useLocal } from "../contexts/local"; // Importa o hook de autenticação local
import { getEstoqueLocalEstocagem } from "../services/laboratorio/service";

const AppLayout = ({ children }) => {
const { usuario } = useContext(AuthContext); // Obtém o usuário do contexto de autenticação
const { labId } = useLocal(); // Obtém o ID do laboratório do contexto local
const [labName, setLabName] = useState(null); // Estado para armazenar o nome do laboratório

useEffect(() => {
  const fetchLabDetails = async () => {
    if (labId) {
      const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
      try {
        const labDetails = await getEstoqueLocalEstocagem(
          codCampus,
          codUnidade,
          codPredio,
          codLaboratorio
        );
        setLabName(labDetails.nomLocal); // Armazena o nome do laboratório
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
    usuario={usuario} // Passa o usuário como prop para o Header
    labName={labName} // Passa o nome do laboratório como prop para o Header
  >
    {children}
  </Header>
);
};

export default AppLayout;