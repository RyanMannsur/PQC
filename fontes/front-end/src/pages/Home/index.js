
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import { FiUsers, FiPackage, FiPlusSquare, FiArchive, FiRefreshCw, FiRepeat, FiMap, FiLayers, FiMapPin } from "react-icons/fi";
import { useLocal } from "../../contexts/local";

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
  const navigate = useNavigate();
  const { labName } = useLocal();

  return (
    <C.Container>
      <C.HeaderHome>
        <C.TitleHome>Bem-vindo{labName ? ` ao ${labName}` : ""}!</C.TitleHome>
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
  );
};

export default Home;