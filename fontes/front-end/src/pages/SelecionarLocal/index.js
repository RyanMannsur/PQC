import { useState, useContext, useEffect } from "react";
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
          if (labs.length === 1) {
            const selectedLab = labs[0];
            setLab(selectedLab);
            setLabId(selectedLab);
            navigate("/home");
            return;
          }

          // Se houver mais de um laboratório, formatar para exibir na lista
          const formatted = labs.map((lab, index) => ({
            id: index.toString(),
            nomLocal: lab.nomLocal,
            codCampus: lab.codCampus,
            codUnidade: lab.codUnidade,
            codPredio: lab.codPredio,
            codLaboratorio: lab.codLaboratorio,
          }));

          setLabOptions(formatted);
        }
      } catch (err) {
        console.error("Erro ao buscar locais:", err);
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
        {labOptions.length > 1 && (
          <Select
            options={labOptions.map((lab) => ({
              value: lab.codLaboratorio,
              label: lab.nomLocal,
              object: lab,
            }))}
            value={lab ? lab.codLaboratorio : ""}
            onChange={(selectedOption) => {
              setLab(selectedOption.object);
              setError("");
            }}
          />
        )}
        <C.labelError>{error}</C.labelError>
        {labOptions.length > 1 && <Button Text="Selecionar" onClick={handleSelect} />}
      </C.Content>
    </C.Container>
  );
};

export default SelecionarLocal;
