import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import ImplantacaoList from "../../features/implantacao";
import Modal from "../../components/Modal"; 
import { Select, Button, FormGroup } from "../../components"; 
import { obterProdutosPorLaboratorio, cadastrarProdutos } from "../../services/produto/service"; 
import { useLocal } from "../../contexts/local";
import * as C from "./styles";

const CreateProdutos = () => {
const [produtos, setProdutos] = useState([]);
const [implantacoes, setImplantacoes] = useState({});
const [tipoCadastro, setTipoCadastro] = useState(""); 
const [loading, setLoading] = useState(true);
const { labId, labName } = useLocal(); 
const [isModalOpen, setIsModalOpen] = useState(false); 
const navigate = useNavigate(); 

useEffect(() => {
  const fetchLabDetailsAndProdutos = async () => {
    if (labId) {
      const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
      try {
        const produtosResponse = await obterProdutosPorLaboratorio(
          codCampus,
          codUnidade,
          codPredio,
          codLaboratorio
        );

        const formattedProdutos = produtosResponse.map((produto) => ({
          codProduto: produto.codProduto,
          nomProduto: produto.nomProduto,
          nomLista: produto.nomLista,
          perPureza: produto.perPureza,
          vlrDensidade: produto.vlrDensidade,
        }));

        setProdutos(formattedProdutos);
      } catch (error) {
        console.error("Erro ao buscar detalhes do laboratório ou produtos:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  fetchLabDetailsAndProdutos();
}, [labId]);

const handleConfirm = async () => {
  if (!tipoCadastro) {
    alert("Por favor, selecione o tipo de cadastro antes de confirmar.");
    return;
  }

  if (!labId) {
    console.error("Laboratório não selecionado.");
    return;
  }

  const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;

  const dadosParaEnvio = {
    tipoCadastro: tipoCadastro.value,
    codCampus,
    codUnidade,
    codPredio,
    codLaboratorio,
    produtos: Object.entries(implantacoes).map(([codProduto, items]) => ({
      codProduto: parseInt(codProduto),
      items: items.map((item) => ({
        qtd: parseFloat(item.qtdEstoque),
        validade: item.datValidade,
        embalagem: item.codEmbalagem,
      })),
    })),
  };

  try {
    console.log("Dados enviados:", dadosParaEnvio);
    const response = await cadastrarProdutos(dadosParaEnvio);
    console.log("Resposta recebida:", response);
    
    if (response && (response.message || response.tipo === "SUCESSO")) {
      console.log("Cadastro realizado com sucesso:", response);
      setIsModalOpen(true); 
    } else {
      console.error("Erro ao realizar cadastro - resposta inválida:", response);
      alert("Erro ao realizar cadastro.");
    }
  } catch (error) {
    console.error("Erro ao realizar cadastro:", error);
    alert("Erro ao realizar cadastro. Verifique os detalhes no console.");
  }
};

const handleCloseModal = () => {
  setIsModalOpen(false); 
  navigate("/inventario"); 
};

const options = [
  { value: "EC", label: "Compra" },
  { value: "ED", label: "Doação" },
];

if (loading) {
  return <C.Loading>Carregando produtos...</C.Loading>;
}

return (
  <C.Container>
    <h1>Cadastrar Produtos no {labName}</h1>

    <C.SelectContainer>
      <label htmlFor="tipoCadastro">Tipo de Cadastro:</label>
      <Select
        options={options}
        value={tipoCadastro?.value || ""}
        onChange={(selectedOption) => setTipoCadastro(selectedOption)}
        placeholder="Selecione o tipo de cadastro"
      />
    </C.SelectContainer>

    {produtos.length > 0 ? (
      <ImplantacaoList
        data={produtos} 
        onChange={(updatedImplantacoes) =>
          setImplantacoes(updatedImplantacoes)
        } 
      />
    ) : (
      <p>Nenhum produto encontrado.</p>
    )}

    <FormGroup $justifyContent="center">
      <Button $variant="primary" onClick={handleConfirm}>Confirmar</Button>
    </FormGroup>

    <Modal
      title="Cadastro Realizado"
      isOpen={isModalOpen}
      onClose={handleCloseModal}
    >
      <p>Os produtos foram cadastrados com sucesso!</p>
    </Modal>
  </C.Container>
);
};

export default CreateProdutos;