import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import ImplantacaoList from "../../features/implantacao";
import Modal from "../../components/Modal"; 
import { obterProdutosNaoImplantadosPorLocal, implantarItensLaboratorio, obterNomeLocalEstocagem } from "../../services/produto/service";
import { useLocal } from "../../contexts/local";
import * as C from "./styles";

const Implantacao = () => {
const [produtos, setProdutos] = useState([]);
const [implantacoes, setImplantacoes] = useState({});
const [loading, setLoading] = useState(true);
const { labId } = useLocal();
const [labName, setLabName] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false); 
const navigate = useNavigate(); 

useEffect(() => {
  const fetchLabDetails = async () => {
    console.log("LabId carregado:", labId);
    if (labId) {
      const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
      try {
        const labDetails = await obterNomeLocalEstocagem(
          codCampus,
          codUnidade,
          codPredio,
          codLaboratorio
        );
        setLabName(labDetails[0].nomLocal);
      } catch (error) {
        console.error("Erro ao buscar detalhes do laboratório:", error);
      }
    }
  };

  const fetchProdutos = async () => {
    const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
    try {
      const produtosResponse = await obterProdutosNaoImplantadosPorLocal(codCampus, codUnidade, codPredio, codLaboratorio,);
      setProdutos(produtosResponse);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchLabDetails();
  fetchProdutos();
}, [labId]);

const handleChange = (updatedImplantacoes) => {
  setImplantacoes(updatedImplantacoes);
};

const handleConfirm = async () => {
  if (!labId) {
    console.error("Laboratório não selecionado.");
    return;
  }

  const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;

  const dadosParaEnvio = {
    codCampus,
    codUnidade,
    codPredio,
    codLaboratorio,
    produtos: Object.entries(implantacoes).map(([codProduto, items]) => ({
      codProduto: parseInt(codProduto),
      items: items.map((item) => ({
        seqEmbalagem: item.seqEmbalagem,
        qtdEstoque: parseFloat(item.qtdEstoque),
        datValidade: item.datValidade,
        txtJustificativa: item.txtJustificativa,
      })),
    })),
  };

  try {
    const response = await implantarItensLaboratorio(dadosParaEnvio);
    if (response) {
      console.log("Implantação realizada com sucesso:", response);
      setIsModalOpen(true); 
    } else {
      console.error("Erro ao realizar implantação.");
      alert("Erro ao realizar implantação.");
    }
  } catch (error) {
    console.error("Erro ao realizar implantação:", error);
    alert("Erro ao realizar implantação. Verifique os detalhes no console.");
  }
};

const handleCloseModal = () => {
  setIsModalOpen(false); 
  navigate("/home"); 
};

if (loading) {
  return <C.Loading>Carregando produtos...</C.Loading>;
}

return (
  <C.Container>
    <C.Title>Implantação de Produtos no {labName}</C.Title>
    <ImplantacaoList data={produtos} onChange={handleChange} />
    <C.ConfirmButton onClick={handleConfirm}>Confirmar</C.ConfirmButton>

    <Modal
      title="Implantação Realizada"
      isOpen={isModalOpen}
      onClose={handleCloseModal}
    >
      <p>A implantação foi realizada com sucesso!</p>
    </Modal>
  </C.Container>
);
};

export default Implantacao;