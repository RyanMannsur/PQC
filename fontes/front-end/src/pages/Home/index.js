import { useEffect, useState } from "react";
import * as C from "./styles";
import { useLocal } from "../../contexts/local";
import { obterEstoqueLocalEstocagem, obterNomeLocalEstocagem } from "../../services/produto/service";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";


const Home = () => {
const { labId } = useLocal();
const [labDetails, setLabDetails] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const navigate = useNavigate();

useEffect(() => {
  const fetchLabDetails = async () => {
    const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;

    try {
      const lab = await obterNomeLocalEstocagem(
        codCampus, codUnidade, codPredio, codLaboratorio
      );
      setLabDetails(lab[0]);

      const produtos = await obterEstoqueLocalEstocagem(
        codCampus, codUnidade, codPredio, codLaboratorio
      );

      const produtosComQuantidade = produtos.filter(produto =>
        Array.isArray(produto.item) && produto.item.some(i => i.qtdEstoque > 0)
      );

      if (produtosComQuantidade.length === 0) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Erro ao buscar informações do laboratório:", error);
    }
  };

  fetchLabDetails();
}, [labId]);

const handleModalClose = () => {
  setIsModalOpen(false);
  navigate("/implantacao"); 
};

if (!labDetails && !isModalOpen) {
  return <C.Label>Carregando informações...</C.Label>;
}

return (
  <>
    <Modal
      title="Implantação Necessária"
      isOpen={isModalOpen}
      onClose={handleModalClose}
    >
      Laboratório vazio. Você será redirecionado(a) para a implantação do local selecionado.
    </Modal>
    {labDetails && (
      <C.Container>
        <C.Content>
          <C.Label>Bem-vindo ao {labDetails.nomLocal}</C.Label>
        </C.Content>
      </C.Container>
    )}
  </>
);
};

export default Home;