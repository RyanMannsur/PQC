import { useState, useContext, useEffect } from "react";
import { Button, Select, FormGroup } from "../../components";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { LocalContext } from "../../contexts/local";
import { obterLocaisEstoque } from "../../services/produto/tokenService";

const SelecionarLocal = () => {
  const { setLabId, setLabName } = useContext(LocalContext); 
  const navigate = useNavigate();

  const [lab, setLab] = useState(null); 
  const [error, setError] = useState(""); 
  const [labOptions, setLabOptions] = useState([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const labs = await obterLocaisEstoque(); 

        if (labs && Array.isArray(labs)) {
          if (labs.length === 1) {
            const selectedLab = labs[0];
            setLab(selectedLab);
            setLabId({
              codCampus: selectedLab.codCampus,
              codUnidade: selectedLab.codUnidade,
              codPredio: selectedLab.codPredio,
              codLaboratorio: selectedLab.codLaboratorio,
            });
            setLabName(selectedLab.nomLocal);
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
    setLabName(lab.nomLocal);
    navigate("/home");
  };

  return (
    <C.Container>
      <C.Label>SELECIONE O LOCAL DE ESTOCAGEM</C.Label>
      <C.Content>
        <FormGroup $gap="medium" $alignItems="center">
          {labOptions.length > 1 && (
            <Select
              options={labOptions.map((lab) => ({
                value: lab.codLaboratorio,
                label: lab.nomLocal,
              }))}
              value={lab ? lab.codLaboratorio : ""}
              onChange={value => {
                const selectedLab = labOptions.find(l => l.codLaboratorio === value);
                setLab(selectedLab);
                setError("");
              }}
              placeholder="Selecione o laboratório"
              $error={!!error}
            />
          )}
          {error && <C.labelError>{error}</C.labelError>}
          {labOptions.length > 1 && (
            <Button onClick={handleSelect} $fullWidth>
              Selecionar
            </Button>
          )}
        </FormGroup>
      </C.Content>
    </C.Container>
  );
};

export default SelecionarLocal;
