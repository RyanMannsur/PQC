import React, { useEffect, useState } from "react";
import * as C from "./styles";
import { useLocal } from "../../contexts/local";
import { getLabs } from "../../services/laboratorio/service";

const Home = () => {
  const { labId } = useLocal();
  const [labDetails, setLabDetails] = useState(null);

  useEffect(() => {
    const fetchLabDetails = () => {
      if (labId) {
        const lab = getLabs(labId);
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
        <C.Label>Bem-vindo ao {labDetails.nomUnidade}</C.Label>
      </C.Content>
    </C.Container>
  );
};

export default Home;
