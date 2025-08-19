
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import { FiUsers, FiPackage, FiPlusSquare, FiArchive, FiRefreshCw, FiRepeat, FiMap, FiLayers, FiMapPin } from "react-icons/fi";
import { useLocal } from "../../contexts/local";
import { obterEstoqueLocalEstocagem } from "../../services/produto/service";
import Modal from "../../components/Modal";

const features = [
  {
    label: "Inventário",
    icon: <FiArchive size={32} />,
    path: "/inventario"
  },
  {
    label: "Trocar Laboratório",
    icon: <FiRefreshCw size={32} />,
    path: "/selecionar-lab"
  },
  {
    label: "Adicionar Produto",
    icon: <FiPlusSquare size={32} />,
    path: "/cadastrar-produto"
  },
  {
    label: "Transferência",
    icon: <FiRepeat size={32} />,
    path: "/transferencias"
  },
  {
    label: "Produto",
    icon: <FiPackage size={32} />,
    path: "/produto"
  },
  {
    label: "Campus",
    icon: <FiMap size={32} />,
    path: "/campus"
  },
  {
    label: "Unidades",
    icon: <FiLayers size={32} />,
    path: "/unidadeorganizacional"
  },
  {
    label: "Local Estocagem",
    icon: <FiMapPin size={32} />,
    path: "/localestocagem"
  },
  {
    label: "Usuário",
    icon: <FiUsers size={32} />,
    path: "/usuarios"
  },
];


const Home = () => {
  const { labId, labName } = useLocal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabDetails = async () => {
      if (!labId) return;
      const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;
      try {
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

  if (!labName && !isModalOpen) {
    return <C.TitleHome>Carregando informações...</C.TitleHome>;
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
      {labName && (
        <C.Container>
          <C.HeaderHome>
            <C.TitleHome>Bem-vindo ao {labName}!</C.TitleHome>
            <C.SubtitleHome>Escolha uma funcionalidade:</C.SubtitleHome>
          </C.HeaderHome>
          <C.CardsGrid>
            {features.map((feature) => (
              <C.CardButton key={feature.label} onClick={() => navigate(feature.path)}>
                <C.CardIcon>{feature.icon}</C.CardIcon>
                <C.CardLabel>{feature.label}</C.CardLabel>
              </C.CardButton>
            ))}
          </C.CardsGrid>
        </C.Container>
      )}
    </>
  );
};

export default Home;