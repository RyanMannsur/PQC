import React, { useState, useEffect } from "react";
import * as C from "./styles";

const ImplantacaoList = ({ data, onChange }) => {
  const [implantacoes, setImplantacoes] = useState({});
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (codProduto) => {
    setExpanded((prev) => ({
      ...prev,
      [codProduto]: !prev[codProduto],
    }));

    if (!implantacoes[codProduto] || implantacoes[codProduto].length === 0) {
      setImplantacoes((prev) => ({
        ...prev,
        [codProduto]: [{ qtdEstoque: "", datValidade: "", codEmbalagem: "", txtJustificativa: "" }],
      }));
    }
  };

  const handleAddSubitem = (codProduto) => {
    setImplantacoes((prev) => ({
      ...prev,
      [codProduto]: [
        ...(prev[codProduto] || []),
        { qtdEstoque: "", datValidade: "", codEmbalagem: "", txtJustificativa: "" },
      ],
    }));
  };

  const handleRemoveSubitem = (codProduto, idx) => {
    setImplantacoes((prev) => ({
      ...prev,
      [codProduto]: prev[codProduto].filter((_, i) => i !== idx),
    }));
  };

  const handleFieldChange = (codProduto, idx, field, value) => {
    setImplantacoes((prev) => ({
      ...prev,
      [codProduto]: prev[codProduto].map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  };

  useEffect(() => {
    onChange(implantacoes);
  }, [implantacoes, onChange]);

  return (
    <C.Table>
      <thead>
        <tr>
          <C.Th>Produto</C.Th>
          <C.Th>Lista</C.Th>
          <C.Th>Pureza</C.Th>
          <C.Th>Densidade</C.Th>
          <C.Th>Ações</C.Th>
        </tr>
      </thead>
      <tbody>
        {data.map((produto) => (
          <React.Fragment key={produto.codProduto}>
            <C.ProductRow>
              <C.Td>{produto.nomProduto}</C.Td>
              <C.Td>{produto.nomLista}</C.Td>
              <C.Td>{produto.perPureza}</C.Td>
              <C.Td>{produto.vlrDensidade}</C.Td>
              <C.Td>
                <C.Button onClick={() => toggleExpand(produto.codProduto)}>
                  {expanded[produto.codProduto] ? "🔼" : "🔽"}
                </C.Button>
              </C.Td>
            </C.ProductRow>

            {expanded[produto.codProduto] && (
              <>
                {implantacoes[produto.codProduto].map((item, idx) => (
                  <C.ItemRow key={`${produto.codProduto}-${idx}`}>
                    <C.SublistTd>
                      Embalagem
                      <C.Input
                        type="text"
                        value={item.codEmbalagem}
                        onChange={(e) =>
                          handleFieldChange(produto.codProduto, idx, "codEmbalagem", e.target.value)
                        }
                      />
                    </C.SublistTd>
                    <C.SublistTd>
                      Quantidade
                      <C.Input
                        type="number"
                        value={item.qtdEstoque}
                        onChange={(e) =>
                          handleFieldChange(produto.codProduto, idx, "qtdEstoque", e.target.value)
                        }
                      />
                    </C.SublistTd>
                    <C.SublistTd>
                      Validade
                      <C.Input
                        type="date"
                        value={item.datValidade}
                        onChange={(e) =>
                          handleFieldChange(produto.codProduto, idx, "datValidade", e.target.value)
                        }
                      />
                    </C.SublistTd>
                    <C.SublistTd>
                      Observação
                      <C.Input
                        type="text"
                        value={item.txtJustificativa}
                        onChange={(e) =>
                          handleFieldChange(produto.codProduto, idx, "txtJustificativa", e.target.value)
                        }
                      />
                    </C.SublistTd>
                    <C.SublistTd>
                      <div class="button-container">
                        <C.Button onClick={() => handleAddSubitem(produto.codProduto)}>
                          ➕
                        </C.Button>
                        <C.Button onClick={() => handleRemoveSubitem(produto.codProduto, idx)}>
                          🗑️
                        </C.Button>
                      </div>  
                    </C.SublistTd>
                  </C.ItemRow>
                ))}
    
              </>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </C.Table>
  );
};

export default ImplantacaoList;
