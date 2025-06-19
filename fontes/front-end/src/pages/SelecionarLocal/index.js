import React, { useState, useContext, useEffect } from "react";
import Select from "../../components/InputSelect";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { LocalContext } from "../../contexts/local";
import { getLabs } from "../../services/laboratorio/service";

const SelecionarLocal = () => {
const { setLabId } = useContext(LocalContext); 
const navigate = useNavigate();

const [lab, setLab] = useState(null); 
const [error, setError] = useState(""); 
const [labOptions, setLabOptions] = useState([]);

useEffect(() => {
  const fetchLabs = async () => {
    try {
      const labs = await getLabs();
      if (labs && Array.isArray(labs)) {
        setLabOptions(
          labs.map((lab) => ({
            id: `${lab.codCampus}-${lab.codUnidade}-${lab.codPredio}-${lab.codLaboratorio}`, 
            nomLocal: lab.nomLocal,
            codCampus: lab.codCampus,
            codUnidade: lab.codUnidade,
            codPredio: lab.codPredio,
            codLaboratorio: lab.codLaboratorio,
          }))
        );

        if (labs.length === 1) {
          const selectedLab = labs[0];
          setLab({
            codCampus: selectedLab.codCampus,
            codUnidade: selectedLab.codUnidade,
            codPredio: selectedLab.codPredio,
            codLaboratorio: selectedLab.codLaboratorio,
          });
          setLabId({
            codCampus: selectedLab.codCampus,
            codUnidade: selectedLab.codUnidade,
            codPredio: selectedLab.codPredio,
            codLaboratorio: selectedLab.codLaboratorio,
          });
          navigate("/home");
        }
      }
    } catch (err) {
      setError("Erro ao buscar locais de estoque.");
    }
  };

  fetchLabs();
}, [navigate, setLabId]);

const handleSelect = () => {
  if (!lab) {
    setError("Por favor, selecione um local");
    return;
  }

  setLabId({
    codCampus: lab.codCampus,
    codUnidade: lab.codUnidade,
    codPredio: lab.codPredio,
    codLaboratorio: lab.codLaboratorio,
  });

  navigate("/home");
};

return (
  <C.Container>
    <C.Label>SELECIONE O LOCAL DE ESTOCAGEM</C.Label>
    <C.Content>
      <Select
        options={labOptions.map((lab) => ({
          value: lab.id,
          label: lab.nomLocal,
          object: lab,
        }))}
        value={lab ? lab.id : ""}
        onChange={(selectedOption) => {
          setLab(selectedOption.object);
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