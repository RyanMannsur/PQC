import React, { useEffect, useState } from "react";
import { consultarProdutos } from "../../services/produto/tokenService";
import { Button } from "../../components";
import * as C from "./styles";

function ConsultaPQC({ labId }) {
  const [data, setData] = useState([]);
  const [visiveis, setVisiveis] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const result = await consultarProdutos();
        setData(result);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    })();
  }, [labId]);

  const toggle = (level, id) => {
    setVisiveis((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  return (
    <C.Table >
      <tbody>
        {data.map((produto) => {
          const isProdutoOpen = visiveis[produto.id];
          return (
            <React.Fragment key={produto.id}>
                <C.ProductRow>
                  <C.Td>
                    <Button 
                      $variant="outline" 
                      size="small" 
                      onClick={() => toggle("produto", produto.id)}
                    >
                      {isProdutoOpen ? "−" : "+"}
                    </Button>
                  </C.Td>
                  <C.Td style={{ paddingLeft: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center"  }} >
                    <C.Td>NCM:{' '}{produto.codProduto}</C.Td>
                    <C.Td>{produto.nomProduto}</C.Td>
                    <C.Td>Concentração:{' '}{produto.perPureza}{' '}</C.Td>
                    <C.Td>Densidade:{' '}{produto.vlrDensidade}{' '}</C.Td>
                    <C.Td><strong>Total do Produto:{' '}{produto.totProduto}</strong></C.Td>
                  </C.Td>
                </C.ProductRow>

              {isProdutoOpen &&
                produto.local.map((campus) => {
                  const isCampusOpen = visiveis[campus.id];
                  return (
                    <React.Fragment key={campus.id}>
                      
                       <C.CampusRow>
                          <C.Td> {/* Célula para o botão */}
                              <Button 
                                $variant="outline" 
                                size="small"
                                onClick={() => toggle("campus", campus.id)}
                              >
                                  {isCampusOpen ? "−" : "+"}
                              </Button>
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
                                  <strong>Local:</strong> {campus.nomCampus} / {campus.nomUnidade} /{" "}
                                  {campus.nomLaboratorio}
                              </div>
                              <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                                  <strong>Total Local:</strong> {campus.totalLocais}
                              </div>
                          </C.Td>
                      </C.CampusRow>

                      {isCampusOpen &&
                        campus.items.map((item) => {
                          const isItemOpen = visiveis[item.id];
                          return (
                            <React.Fragment key={item.id}>
                        
                                <C.ItemRow>
                                  <C.Td>
                                    <Button 
                                      $variant="outline" 
                                      size="small"
                                      onClick={() => toggle("item", item.id)}
                                    >
                                      {isItemOpen ? "−" : "+"}
                                    </Button>
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
                                      Item: {item.seqItem} Embalagem:{item.nomEmbalagem} — Validade:{" "}
                                      {item.datValidade} 
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
                                          {movto.idtTipoMovto}
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
  );
}

export default ConsultaPQC;

