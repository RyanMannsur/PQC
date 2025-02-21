import React, { useEffect, useState } from "react";
import * as C from "./styles";
import { useLab } from "../../contexts/lab";
import { getLabById } from "../../services/laboratorio/service"; // Importando a função

const Home = () => {
  const { labId } = useLab(); // Obtendo o labId do contexto
  const [labDetails, setLabDetails] = useState(null);

  useEffect(() => {
    const fetchLabDetails = () => {
      if (labId) {
        const lab = getLabById(labId); // Buscando o laboratório pelo ID
        setLabDetails(lab);
      }
    };

    fetchLabDetails(); // Chama a função sempre que o labId mudar
  }, [labId]); // Recarregar quando o labId mudar

  if (!labDetails) {
    return <C.Label>Carregando informações...</C.Label>;
  }

  return (
    <C.Container>
      <C.Content>
        <C.Label>Bem-vindo ao {labDetails.nome}</C.Label>
      </C.Content>
    </C.Container>
  );
};

export default Home;
