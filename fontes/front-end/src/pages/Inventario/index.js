import { useEffect, useState } from "react";
import Modal from "../../components/Modal"; 
import * as C from "./styles";
import { useLocal } from "../../contexts/local";
import { obterEstoqueLocalEstocagem } from "../../services/produto/service";
import InventarioList from "../../features/inventario";
import Button from "../../components/Button";
import { formatarData } from "../../helpers/dataHelper";
import { atualizarQuantidadeProdutosLaboratorio } from "../../services/produto/service";

const Inventario = () => {
  const { labId } = useLocal();
  const [produtos, setProdutos] = useState([]);
  const [erro, setErro] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); 

  const dataInicial = "1900-01-01";

  useEffect(() => {
    const fetchProdutos = async () => {
      if (labId) {
        const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;

        try {
          const produtosResponse = await obterEstoqueLocalEstocagem(
            codCampus,
            codUnidade,
            codPredio,
            codLaboratorio,
            dataInicial
          );

          const produtosNegativos = produtosResponse.filter(
            (produto) => produto.qtdEstoque < 0
          );
          if (produtosNegativos.length > 0) {
            setErro("Há produtos com quantidade negativa no estoque!");
            setProdutos([]);
            return;
          }

          const produtosAgrupados = agruparProdutos(produtosResponse);

          setProdutos(produtosAgrupados);
          setErro("");
        } catch (error) {
          console.error("Erro ao buscar produtos e quantidades:", error);
          setProdutos([]);
          setErro("Erro ao buscar produtos e quantidades");
        }
      }
    };

    fetchProdutos();
  }, [labId]);

  const agruparProdutos = (produtosResponse) => {
    const agrupados = {};

    produtosResponse
      .filter((produto) => produto.qtdEstoque > 0) 
      .forEach((produto) => {
        const {
          codProduto,
          nomProduto,
          perPureza,
          vlrDensidade,
          datValidade,
          seqItem,
          qtdEstoque,
        } = produto;

        if (!agrupados[codProduto]) {
          agrupados[codProduto] = {
            codProduto,
            nomProduto,
            perPureza,
            vlrDensidade,
            itens: [],
          };
        }

        agrupados[codProduto].itens.push({
          seqItem,
          datValidade: formatarData(datValidade),
          qtdAtual: qtdEstoque,
          qtdNova: qtdEstoque, 
        });
      });

    return Object.values(agrupados);
  };

  const handleQuantityChange = (codProduto, seqItem, newQuantity) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) =>
        produto.codProduto === codProduto
          ? {
              ...produto,
              itens: produto.itens.map((item) =>
                item.seqItem === seqItem
                  ? { ...item, qtdNova: newQuantity }
                  : item
              ),
            }
          : produto
      )
    );
  };

  const enviarAtualizacao = async () => {
    if (!labId) return;

    const { codCampus, codUnidade, codPredio, codLaboratorio } = labId;

    const payload = {
      codCampus,
      codUnidade,
      codPredio,
      codLaboratorio,
      produtos: produtos.flatMap((produto) =>
        produto.itens.map((item) => ({
          codProduto: produto.codProduto,
          seqItem: item.seqItem,
          qtdEstoque: parseFloat(item.qtdNova), 
        }))
      ),
    };

    try {
      const result = await atualizarQuantidadeProdutosLaboratorio(
        payload.codCampus,
        payload.codUnidade,
        payload.codPredio,
        payload.codLaboratorio,
        payload.produtos
      );

      if (result.error) {
        setModalMessage("Houve um erro ao atualizar. Tente novamente amanhã, pois já foi feita uma atualização hoje.");
        setModalOpen(true);
      } else {
        setModalMessage("Movimentações de estoque criadas com sucesso!");
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Erro ao enviar atualização:", err);
      setModalMessage("Houve um erro ao atualizar. Tente novamente amanhã, pois já foi feita uma atualização hoje.");
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    window.location.reload(); 
  };

  return (
    <C.Container>
      <h1>Inventário</h1>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {produtos.length > 0 ? (
        <InventarioList data={produtos} onQuantityChange={handleQuantityChange} />
      ) : (
        <p>Nenhum produto encontrado no inventário.</p>
      )}
      <C.ButtonGroup>
        <Button
          Text="Confirmar Atualização"
          onClick={enviarAtualizacao}
        />
      </C.ButtonGroup>
      <Modal
        title="Aviso"
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <p>{modalMessage}</p>
      </Modal>
    </C.Container>
  );
};

export default Inventario;
