import React, { useState, useEffect } from "react";
import Select from "../../components/InputSelect";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { getLabsByToken } from "../../services/laboratorio/service";
import useAuth from "../../hooks/useAuth";

const SelecionarLab = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [lab, setLab] = useState("");
  const [error, setError] = useState("");
  const [labOptions, setLabOptions] = useState([]);

  useEffect(() => {
    if (usuario) {
      const labs = getLabsByToken(usuario.token);
      setLabOptions(labs);

      if (labs.length === 1) {
        navigate(`/laboratorio/${labs[0].id}`);
      }
    }
  }, [usuario, navigate]);

  const handleSelect = () => {
    if (!lab) {
      setError("Por favor, selecione um laboratório");
      return;
    }

    navigate(`/laboratorio/${lab}`);
  };

  return (
    <C.Container>
      <C.Label>SELECIONE O LABORATÓRIO</C.Label>
      <C.Content>
        <Select
          options={labOptions.map((lab) => ({
            value: lab.id,
            label: lab.nome,
          }))}
          value={lab}
          onChange={(e) => [setLab(e.target.value), setError("")]}
        />
        <C.labelError>{error}</C.labelError>
        <Button Text="Selecionar" onClick={handleSelect} />
      </C.Content>
    </C.Container>
  );
};

export default SelecionarLab;
