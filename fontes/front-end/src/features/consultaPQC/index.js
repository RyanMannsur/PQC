import React, { useEffect, useState } from "react";
import produtoService from "../../services/produtoService";
import * as C from "./styles";
import { BotaoMaisMenos } from "./styles";
import StatusMessage from "../../components/StatusMensagem";

function ConsultaPQC({ labId }) {
  const [data, setData] = useState([]);
  const [visiveis, setVisiveis] = useState({});
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null) 
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"))
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

    (async () => {
      try {
        setLoading(true)
        const result = await produtoService.consultaPQC(usuario.codCPF);
        setData(result);
      } catch (error) {
         const msg = 'Erro no servidor. ' + error;
        setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
      } finally {
        setLoading(false);
      }
    })();
  }, [labId]);

  const toggle = (level, id) => {
    setVisiveis((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseMessage = () => {
    setStatusMessage(null);
  };

  return (
    <>
    <h3 style={{ textAlign: "center" }}>Consulta Movimentação do Estoque</h3>
    <C.Table >
      <tbody>
        {data.map((produto) => {
          const isProdutoOpen = visiveis[produto.id];
          return (
            
            <React.Fragment key={produto.id}>
              <C.ProductRow>
                <C.Td> 
                  <BotaoMaisMenos
                    onClick={() => toggle("produto", produto.id)}
                  >
                    {isProdutoOpen ? "−" : "+"}
                  </BotaoMaisMenos>
                </C.Td>
    
               <C.Td style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "0.5rem" }}>
                  {/* Grupo da esquerda */}
                  <div>
                    NCM:{' '}{produto.codProduto}
                    {' - '}{produto.nomProduto}
                    <div>
                      Concentração: {produto.perPureza}
                    </div>
                    <div>    
                      Densidade: {produto.vlrDensidade}          
                    </div>
                  </div>
                  {/* Grupo da direita, com espaçamento entre os itens */}
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <div>
                      <strong>Total do Produto:{' '}{produto.totProduto}</strong>
                    </div>
                  </div>
                </C.Td>
              </C.ProductRow>

              {isProdutoOpen &&
                produto.local.map((local) => {
                  const isLocalOpen = visiveis[local.id];
                  return (
                    <React.Fragment key={local.id}>   
                       <C.LocalRow>
                          <C.Td> {/* Célula para o botão */}
                              <BotaoMaisMenos 
                                onClick={() => toggle("local", local.id)}
                              >
                                  {isLocalOpen ? "−" : "+"}
                              </BotaoMaisMenos>
                          </C.Td>
                          {/* Esta é a ÚNICA C.Td para o conteúdo principal, ocupando as colunas restantes */}
                          <C.Td 
                            colSpan={5} 
                            style={{ 
                              paddingLeft: "1.5rem", 
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "center" 
                            }}
                          >
                              {/* Primeiro div para as informações de Local (à esquerda) */}
                              <div>
                                  <strong>Local:</strong> {local.nomCampus} / {local.nomUnidade} /{" "}
                                  {local.nomLaboratorio}
                              </div>
                              <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                  <strong>Total Local:</strong> {local.totalLocais}
                              </div>
                          </C.Td>
                      </C.LocalRow>

                      {isLocalOpen &&
                        local.items.map((item) => {
                          const isItemOpen = visiveis[item.id];
                          return (
                            <React.Fragment key={item.id}>
                                <C.ItemRow>
                                  <C.Td>
                                    <BotaoMaisMenos 
                                      onClick={() => toggle("item", item.id)}
                                    >
                                      {isItemOpen ? "−" : "+"}
                                    </BotaoMaisMenos>
                                  </C.Td>
                                  <C.Td 
                                      colSpan={5} 
                                      style={{ 
                                        paddingLeft: "3rem", 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "left" 
                                      }}
                                    >
                                    <div> 
                                      Item: {item.seqItem} — Validade:{" "} {item.datValidade} {" "}
                                            Embalagem: {" "} {item.codEmbalagem} 
                                    </div>
                                    <div>                                      
                                      Total Item:{" "}
                                      {item.totalItem}
                                    </div>
                                  </C.Td> 
                                </C.ItemRow>
                          
                              {isItemOpen &&
                                item.movtos.map((movto) => (
                                  <C.MovRow key={movto.id}>
                  
                                  <C.Td />
                        
                                   <C.Td colSpan={5} style={{ paddingLeft: "4.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                                        <div style={{textAlign: "left"}}>
                                          <strong>Data:</strong>{" "}
                                          {movto.datMovto} —{" "}
                                          {movto.idtTipoMovto} - {" "}
                                          {movto.txtJustificativa}
                                        </div>
                                        <div style={{ textAlign: "right", 
                                                      whiteSpace: "nowrap",
                                                      color: movto.qtdMovto < 0 ? 'red' : 'inherit' 
                                                    }}>
                                            {movto.qtdMovto}
                                          </div>
                                        </C.Td>
                                    </C.MovRow>
                                
                                ))}
                            </React.Fragment>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
            </React.Fragment>
          );
        })}
      </tbody>
    </C.Table>
    {statusMessage && (
      <StatusMessage
        message={statusMessage}
        onClose={handleCloseMessage}
      />
     )}
  </>
  );
}

export default ConsultaPQC;

