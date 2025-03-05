import React, { useEffect, useState } from "react";
import * as C from "./styles";
import { useLocal } from "../../contexts/local";
import { getEstoqueLocalEstocagem } from "../../services/laboratorio/service";

const Home = () => {
  const { labId } = useLocal();
  const [labDetails, setLabDetails] = useState(null);

  useEffect(() => {
    const fetchLabDetails = async () => {
      if (labId) {
        const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
        const lab = await getEstoqueLocalEstocagem(
          codCampus,
          codUnidade,
          codPredio,
          codLaboratorio
        );
        setLabDetails(lab);
      }
    };

    fetchLabDetails();
  }, [labId]);

  if (!labDetails) {
    return <C.Label>Carregando informações...</C.Label>;
  }

  return (
    <C.Container>
      <C.Content>
        <C.Label>Bem-vindo ao {labDetails.nomLocal}</C.Label>
      </C.Content>
    </C.Container>
  );
};

export default Home;
