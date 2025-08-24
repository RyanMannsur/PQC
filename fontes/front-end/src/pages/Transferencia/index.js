import { useEffect, useState } from "react";
import * as C from "./styles";
import produtoService from "../../services/produtoService"
import localEstocagem from "../../services/localEstocagemService";
import TransferenciaList from "../../features/transferencia";
import Button from "../../components/Button";
import { formatarData } from "../../helpers/dataHelper";
import StatusMessage from "../../components/StatusMensagem";

const Transferencia = () => {
  const [produtos, setProdutos] = useState([]);
  const [locaisDestino, setLocaisDestino] = useState([]); 
  const [localSelecionado, setLocalSelecionado] = useState(''); 
  const [usuario, setUsuario] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchLocais = async () => {
    try {
      setLoading(true);
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(usuario);
      if (!usuario) {
        setStatusMessage({ tipo: 'ERRO', mensagem: ['Erro ao acessar dados do usuário'] });
        return;
      }

      const lab = usuario.laboratorios[usuario.indCorrente]
      if (lab.codCampus === null) {
        setStatusMessage({ tipo: 'AVISO', mensagem: ['Usuario não está como responsável de nenhum laboratório'] });
        setLoading(false);
        return;
      }
      
      const response = await localEstocagem.obterOutrosLocaisEstocagem(lab.codCampus, lab.codUnidade, lab.codPredio, lab.codLaboratorio);
      
      if (Array.isArray(response)) {
        setLocaisDestino(response);
      } else {
        setStatusMessage(response);
      }
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) return;

      const lab = usuario.laboratorios[usuario.indCorrente];
      const response = await produtoService.obterEstoqueLocalEstocagem(
        lab.codCampus,
        lab.codUnidade,
        lab.codPredio,
        lab.codLaboratorio
      );

      const produtosAgrupados = agruparProdutos(response);
      setProdutos(produtosAgrupados);
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocais();
    fetchProdutos();
  }, []);

  const agruparProdutos = (produtosResponse) => {
    const mapa = {};
    if (!Array.isArray(produtosResponse)) return [];

    produtosResponse.forEach((produto) => {
      const { codProduto, nomProduto, perPureza, vlrDensidade, item } = produto;
      if (!Array.isArray(item)) return;

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
          qtdTransferir: 0,
        });
      });
    });

    return Object.values(mapa);
  };

  const handleQuantityChange = (codProduto, seqItem, qtdTransferir) => {
    setProdutos((prevProdutos) =>
      prevProdutos.map((produto) =>
        produto.codProduto === codProduto
          ? {
              ...produto,
              itens: produto.itens.map((item) =>
                item.seqItem === seqItem
                  ? { ...item, qtdTransferir: qtdTransferir}
                  : item
              ),
            }
          : produto
      )
    );
  };
  
  const enviarAtualizacao = async () => {
    if (!usuario) return;
    if (!localSelecionado) {
      setStatusMessage({ tipo: 'ERRO', mensagem: ['Selecione um local de destino para a transferência.'] });
      return;
    }

    const lab = usuario.laboratorios[usuario.indCorrente];
    const [codCampusDestino, codUnidadeDestino, codPredioDestino, codLaboratorioDestino] = localSelecionado.split('/');

    const payload = {
      codCampusOrigem: lab.codCampus,
      codUnidadeOrigem: lab.codUnidade,
      codPredioOrigem: lab.codPredio,
      codLaboratorioOrigem: lab.codLaboratorio,
      codCampusDestino: codCampusDestino,
      codUnidadeDestino: codUnidadeDestino,
      codPredioDestino: codPredioDestino,
      codLaboratorioDestino: codLaboratorioDestino,
      produtos: produtos.flatMap((produto) =>
        produto.itens
          .filter((item) => item.qtdTransferir > 0)
          .map((item) => ({
            codProduto: produto.codProduto,
            seqItem: item.seqItem,
            codEmbalagem: item.codEmbalagem,
            qtdEstoque: parseFloat(item.qtdAtual),
            qtdTransferir: parseFloat(item.qtdTransferir), 
        }))
      ),
    };
    
    try {
      setLoading(true);
      const response = await produtoService.atualizarTransferencia(payload);
      setStatusMessage(response);
    } catch (err) {
      const msg = 'Erro no servidor.' + err.message;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseMessage = () => {
    setStatusMessage(null);
  };

  return (
    <C.Container>
      <h1>Transferência</h1>
      
      {/* Listbox para seleção do local de destino */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="locaisDestino">Transferir para:</label>
        <select
          id="locaisDestino"
          value={localSelecionado}
          onChange={(e) => setLocalSelecionado(e.target.value)}
          style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px' }}
        >
          <option value="">Selecione um local...</option>
          {locaisDestino.map(local => (
            <option 
              key={`${local.codCampus}/${local.codUnidade}/${local.codPredio}/${local.codLaboratorio}`}
              value={`${local.codCampus}/${local.codUnidade}/${local.codPredio}/${local.codLaboratorio}`}
            >
               {`${local.codCampus}/${local.codUnidade} - ${local.nomLocal}`}
            </option>

          ))}
        </select>
      </div>

      {statusMessage && (
        <StatusMessage
          message={statusMessage}
          onClose={handleCloseMessage}
        />
      )}

      {produtos.length > 0 ? (
        <TransferenciaList data={produtos} onQuantityChange={handleQuantityChange} />
      ) : (
        <p>Nenhum produto encontrado no local.</p>
      )}

      <C.ButtonGroup>
        <Button
          Text="Confirmar Atualização"
          onClick={enviarAtualizacao}
          size="large"
          $fullWidth
          disabled={!localSelecionado || loading}
        />
      </C.ButtonGroup>
    </C.Container>
  );
};

export default Transferencia;