import React, { useState, useEffect } from "react";
import Select from "../../components/InputSelect";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import api, { setLabId, getLabs } from "../../services/laboratorio/service";

const SelecionarLocal = () => {
  const navigate = useNavigate();

  const [lab, setLab] = useState("");
  const [error, setError] = useState("");
  const [labOptions, setLabOptions] = useState([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const labs = await getLabs();
        if (labs && Array.isArray(labs)) {
          setLabOptions(labs);

          if (labs.length === 1) {
            const selectedLab = labs[0];
            setLabId({
              codCampus: selectedLab[0],
              codUnidade: selectedLab[1],
              codPredio: selectedLab[2],
              codLaboratorio: selectedLab[3],
            });
            navigate("/home");
          }
        }
      } catch (err) {
        setError("Erro ao buscar locais de estoque.");
      }
    };

    fetchLabs();
  }, [navigate]);

  const handleSelect = () => {
    if (!lab) {
      setError("Por favor, selecione um local");
      return;
    }

    const selectedLab = labOptions.find((option) => option.id === lab);

    if (selectedLab) {
      setLabId({
        codCampus: selectedLab[0],
        codUnidade: selectedLab[1],
        codPredio: selectedLab[2],
        codLaboratorio: selectedLab[3],
      });
      navigate("/home");
    }
  };

  return (
    <C.Container>
      <C.Label>SELECIONE O LOCAL DE ESTOCAGEM</C.Label>
      <C.Content>
        <Select
          options={labOptions.map((lab) => ({
            value: lab.id,
            label: lab.nomLocal,
          }))}
          value={lab}
          onChange={(e) => {
            setLab(e.value);
            setError("");
          }}
        />
        <C.labelError>{error}</C.labelError>
        <Button Text="Selecionar" onClick={handleSelect} />
      </C.Content>
    </C.Container>
  );
};

export default SelecionarLocal;
