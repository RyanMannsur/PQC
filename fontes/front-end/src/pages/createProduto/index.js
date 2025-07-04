import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import ImplantacaoList from "../../features/implantacao";
import Modal from "../../components/Modal"; 
import Select from "../../components/InputSelect"; 
import { obterProdutosNaoImplantadosPorLocal, cadastrarProdutos, obterNomeLocalEstocagem } from "../../services/produto/service"; 
import { useLocal } from "../../contexts/local";
import * as C from "./styles";

const CreateProdutos = () => {
const [produtos, setProdutos] = useState([]);
const [implantacoes, setImplantacoes] = useState({});
const [tipoCadastro, setTipoCadastro] = useState(""); 
const [loading, setLoading] = useState(true);
const { labId } = useLocal(); 
const [labName, setLabName] = useState(null); 
const [isModalOpen, setIsModalOpen] = useState(false); 
const navigate = useNavigate(); 

useEffect(() => {
  const fetchLabDetailsAndProdutos = async () => {
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

        const produtosResponse = await obterProdutosNaoImplantadosPorLocal(
          codCampus,
          codUnidade,
          codPredio,
          codLaboratorio
        );

        const formattedProdutos = produtosResponse.map((produto) => [
          produto.codProduto,
          produto.nomProduto,
          produto.nomLista,
          produto.perPureza,
          produto.vlrDensidade,
        ]);

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
        qtd: parseFloat(item.qtd),
        validade: item.validade,
        embalagem: item.embalagem || "A",
      })),
    })),
  };

  try {
    const response = await cadastrarProdutos(dadosParaEnvio);
    if (response) {
      console.log("Cadastro realizado com sucesso:", response);
      setIsModalOpen(true); 
    } else {
      console.error("Erro ao realizar cadastro.");
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

    <C.ConfirmButton onClick={handleConfirm}>Confirmar</C.ConfirmButton>

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