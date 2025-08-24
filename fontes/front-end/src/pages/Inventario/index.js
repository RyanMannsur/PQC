import { useEffect, useState } from "react";
import * as C from "./styles";
import produtoService from "../../services/produtoService"
import InventarioList from "../../features/inventario";
import Button from "../../components/Button";
import { formatarData } from "../../helpers/dataHelper";
import { CircularProgress } from "@mui/material";
import StatusMessage from "../../components/StatusMensagem";

const Inventario = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(usuario);
    if (!usuario) {
      setStatusMessage({ tipo: 'ERRO', mensagem: ['Erro ao acessar dados do usuário'] });
      setLoading(false);
      return;
    }

    const lab = usuario.laboratorios[usuario.indCorrente]
    if (lab.codCampus === null) {
      setStatusMessage({ tipo: 'AVISO', mensagem: ['Usuario não está como responsável de nenhum laboratório'] });
      setLoading(false);
      return;
    }
    const fetchProdutos = async () => {
      try {
        setLoading(true)
        const lab = usuario.laboratorios[usuario.indCorrente]
        const response = await produtoService.obterEstoqueLocalEstocagem(
          lab.codCampus,
          lab.codUnidade,
          lab.codPredio,
          lab.codLaboratorio
        );
        if (Array.isArray(response)) {
           const produtosAgrupados = agruparProdutos(response);  
           setProdutos(produtosAgrupados);
        } else {
          setStatusMessage(response);
        }       
      } catch (error) {
        const msg = 'Erro no servidor. ' + error;
        setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
      } finally {
        setLoading(false);
      }
    };
    fetchProdutos();
  }, []);

  const agruparProdutos = (produtosResponse) => {
    const mapa = {};

    produtosResponse.forEach((produto) => {
      const { codProduto, nomProduto, perPureza, vlrDensidade, item } = produto;
      if (!Array.isArray(item)) 
        return; 

      if (!mapa[codProduto]) {
        mapa[codProduto] = {
          codProduto,
          nomProduto,
          perPureza,
          vlrDensidade,
          itens: [],
        };
      }

      item.forEach(({ seqItem, datValidade, codEmbalagem, qtdEstoque }) => {
        mapa[codProduto].itens.push({
          seqItem,
          datValidade: formatarData(datValidade),
          codEmbalagem: codEmbalagem,
          qtdAtual: qtdEstoque,
          qtdNova: qtdEstoque,
        });
      });
    });

    return Object.values(mapa);
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
    const lab = usuario.laboratorios[usuario.indCorrente]

    const payload = {
      codCampus: lab.codCampus,
      codUnidade: lab.codUnidade,
      codPredio: lab.codPredio,
      codLaboratorio: lab.codLaboratorio,
      produtos: produtos.flatMap((produto) =>
        produto.itens.map((item) => ({
          codProduto: produto.codProduto,
          seqItem: item.seqItem,
          codEmbalagem: item.codEmbalagem,
          qtdEstoque: parseFloat(item.qtdAtual),
          qtdNova: parseFloat(item.qtdNova), 
        }))
      ),
    };

    try {
      setLoading(true)
      const response = await produtoService.atualizarInventario(payload)
      setStatusMessage(response) 
     } catch (error) {
      const msg = 'Erro no servidor. ' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };


  const handleCloseMessage = () => {
    setStatusMessage(null);
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <C.Container>
          <h1>Inventário</h1>
          {produtos.length > 0 ? (
            <>
              <InventarioList data={produtos} onQuantityChange={handleQuantityChange} />
              <C.ButtonGroup>
                <Button
                  Text="Confirmar Atualização"
                  onClick={enviarAtualizacao}
                  size="large"
                  $fullWidth
                />
              </C.ButtonGroup>
            </>
          ) : (
            <p>Nenhum produto encontrado no inventário.</p>
          )}
        </C.Container>
      )}
      
      {/* O StatusMessage permanece fora do container principal, como você queria */}
      {statusMessage && (
        <StatusMessage
          message={statusMessage}
          onClose={handleCloseMessage}
        />
      )}
    </>
  )
}

export default Inventario;
