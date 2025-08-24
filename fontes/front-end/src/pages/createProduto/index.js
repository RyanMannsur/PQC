import { useState, useEffect } from "react";
import { Select, Button, FormGroup } from "../../components"; 
import ImplantacaoList from "../../features/implantacao";
import produtoService from "../../services/produtoService"; 
import * as C from "./styles";
import { CircularProgress } from "@mui/material";
import StatusMessage from "../../components/StatusMensagem";

const CreateProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [implantacoes, setImplantacoes] = useState({});
  const [tipoCadastro, setTipoCadastro] = useState(""); 
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  
  useEffect(() => {
    const fetchLabDetailsAndProdutos = async () => {
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
        const produtosResponse = await produtoService.obterProdutosPorLaboratorio(
          lab.codCampus,
          lab.codUnidade,
          lab.codPredio,
          lab.codLaboratorio
        );

        const formattedProdutos = produtosResponse.map((produto) => ({
          codProduto: produto.codProduto,
          nomProduto: produto.nomProduto,
          nomLista: produto.nomLista,
          perPureza: produto.perPureza,
          vlrDensidade: produto.vlrDensidade,
          ncm: produto.ncm,
        }));

        setProdutos(formattedProdutos);
      } catch (error) {
        const msg = 'Erro no servidor. ' + error;
        setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
      } finally {
        setLoading(false);
      }
    };

    fetchLabDetailsAndProdutos();
  }, []);

  const handleConfirm = async () => {
    const lab = usuario.laboratorios[usuario.indCorrente]

    const dadosParaEnvio = {
      tipoCadastro: tipoCadastro,
      codCampus: lab.codCampus,
      codUnidade: lab.codUnidade,
      codPredio: lab.codPredio,
      codLaboratorio: lab.codLaboratorio,
      produtos: Object.entries(implantacoes).map(([codProduto, items]) => ({
        codProduto: parseInt(codProduto),
        items: items.map((item) => ({
          qtdEstoque: parseFloat(item.qtdEstoque),
          datValidade: item.datValidade,
          codEmbalagem: item.codEmbalagem,
          txtJustificativa: item.txtJustificativa,
        })),
      })),
    };

    try {
      setLoading(true)
      const response = await produtoService.atualizarMovtoEstoqueCompraDoacao(dadosParaEnvio);
      setStatusMessage(response)
    } catch (error) {
      const msg = 'Erro no servidor. ' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { value: "EC", label: "Compra" },
    { value: "ED", label: "Doação" },
  ];

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
          <h1>Cadastrar Produtos no {usuario.laboratorios[usuario.indCorrente].nomLocal}</h1>

          <C.SelectContainer>
            <label htmlFor="tipoCadastro">Tipo de Cadastro:</label>
            <Select
              options={options}
              value={tipoCadastro}
              onChange={setTipoCadastro}
              placeholder="Selecione o tipo de cadastro"
              name="tipoCadastro"
              id="tipoCadastro"
            />
          </C.SelectContainer>

          {produtos.length > 0 ? (
            <>
              <ImplantacaoList
                data={produtos}
                onChange={(updatedImplantacoes) =>
                  setImplantacoes(updatedImplantacoes)
                }
              />
              <FormGroup $justifyContent="center">
                <Button $variant="primary" onClick={handleConfirm}>Confirmar</Button>
              </FormGroup>
            </>
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </C.Container>
      )}
      
      {statusMessage && (
        <StatusMessage
          message={statusMessage}
          onClose={handleCloseMessage}
        />
      )}
    </>
  );
}

export default CreateProdutos;