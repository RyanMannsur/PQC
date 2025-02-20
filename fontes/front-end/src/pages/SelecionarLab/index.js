import React, { useState, useEffect } from "react";
import Select from "../../components/InputSelect";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { getLabsByCpf } from "../../services/laboratorio/service";

const SelectLab = () => {
  const navigate = useNavigate();

  const [lab, setLab] = useState("");
  const [error, setError] = useState("");
  const [labOptions, setLabOptions] = useState([]);

  useEffect(() => {
    const cpf = localStorage.getItem("user_cpf");
    console.log("CPF recuperado:", cpf);

    if (cpf) {
      const labs = getLabsByCpf(cpf);
      console.log("Labs encontrados:", labs);
      setLabOptions(labs);

      if (labs.length === 1) {
        navigate(`/laboratorio/${labs[0].id}`);
      }
    }
  }, [navigate]);

  const handleSelect = () => {
    if (!lab) {
      setError("Por favor, selecione um laboratório");
      return;
    }

    console.log("Laboratório selecionado:", lab); // Verifique o laboratório selecionado
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

export default SelectLab;
