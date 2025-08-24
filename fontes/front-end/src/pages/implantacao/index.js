import { useState, useEffect } from "react";
import ImplantacaoList from "../../features/implantacao";
import { Button, FormGroup } from "../../components";
import produtoService from "../../services/produtoService";
import * as C from "./styles";
import { CircularProgress } from "@mui/material";
import StatusMessage from "../../components/StatusMensagem";

const Implantacao = () => {
  const [produtos, setProdutos] = useState([]);
  const [implantacoes, setImplantacoes] = useState({});
  const [usuario, setUsuario] = useState(null) 
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  
  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true)
      const usuario = JSON.parse(localStorage.getItem("usuario"))
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
      
      try {
        const response = await produtoService.obterProdutosNaoImplantadosPorLocal(lab.codCampus, lab.codUnidade, lab.codPredio, lab.codLaboratorio);
        if (Array.isArray(response)) {
          setProdutos(response);
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

  const handleChange = (updatedImplantacoes) => {
    setImplantacoes(updatedImplantacoes);
  };

  const handleConfirm = async () => {
    const lab = usuario.laboratorios[usuario.indCorrente]

    const dadosParaEnvio = {
      codCampus: lab.codCampus,
      codUnidade: lab.codUnidade,
      codPredio: lab.codPredio,
      codLaboratorio: lab.codLaboratorio,
      produtos: Object.entries(implantacoes).map(([codProduto, items]) => ({
        codProduto: parseInt(codProduto),
        items: items.map((item) => ({
          codEmbalagem: item.codEmbalagem, 
          qtdEstoque: parseFloat(item.qtdEstoque),
          datValidade: item.datValidade,
          txtJustificativa: item.txtJustificativa,
        })),
      })),
    };

    try {
      setLoading(true)
      const response = await produtoService.implantarItensLaboratorio(dadosParaEnvio);
      setStatusMessage(response);
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
        // Conteúdo principal do formulário
        <C.Container>
          <C.Title>Implantação de Produtos no {usuario.laboratorios[usuario.indCorrente].nomLocal}</C.Title>
          <ImplantacaoList data={produtos} onChange={handleChange} />
          <FormGroup $justifyContent="center">
            <Button $variant="primary" onClick={handleConfirm}>Confirmar</Button>
          </FormGroup>
        </C.Container>
      )}

      {/* RENDERIZA O STATUS MESSAGE AQUI */}
      {statusMessage && (
        <StatusMessage
          message={statusMessage}
          onClose={handleCloseMessage}
        />
      )}
    </>
  );
};

export default Implantacao;