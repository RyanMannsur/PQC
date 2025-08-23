import React, { useRef } from "react";
import * as C from "./styles";
import QrCodeGenerationSelector from "../QrCode/GeneratorSelector";
import QrCodePrintButton from "../QrCode/PrintButton";

const InventarioList = ({ data, onQuantityChange }) => {
  // Initialize qrCodeRefs as an object
  const qrCodeRefs = useRef({});
  
  const fetchQrCodes = () => {
    alert("Fetching QR Codes for all items!");
    let qrCodeDataArray = [];

    Object.keys(qrCodeRefs.current).forEach((produtoKey) => {
      const produtoRef = qrCodeRefs.current[produtoKey];
      Object.keys(produtoRef).forEach((itemKey) => {
        const ref = produtoRef[itemKey];        
        if (ref && ref.current && ref.current.fetchQrCode) {
          if(ref.current.isChecked()){
            qrCodeDataArray.push(ref.current.fetchQrCode());
          }
        }
      });
    });
  };

  return (
    <C.Table>
      <thead>
        <tr>
          <C.Th>Produto</C.Th>
          <C.Th>Pureza</C.Th>
          <C.Th>Densidade</C.Th>
          <C.Th>Validade</C.Th>
          <C.Th>Item</C.Th>
          <C.Th>Quantidade Atual</C.Th>
          <C.Th>Nova Quantidade</C.Th>
          <C.Th><QrCodePrintButton fetchQrFunction={fetchQrCodes} /></C.Th>
        </tr>
      </thead>
      <tbody>
        {data.map((produto) => (
          <React.Fragment key={produto.codProduto}>
            {produto.itens.map((item, index) => {
              // Ensure qrCodeRefs[produto.codProduto] exists before assigning
              if (!qrCodeRefs.current[produto.codProduto]) {
                qrCodeRefs.current[produto.codProduto] = {};
              }

              // Create and assign a ref to the specific item
              const qrCodeRef = React.createRef();
              qrCodeRefs.current[produto.codProduto][item.seqItem] = qrCodeRef;

              return (
                <tr key={`${produto.codProduto}-${item.seqItem}`}>
                  {index === 0 && (
                    <>
                      <C.Td rowSpan={produto.itens.length}>{produto.nomProduto}</C.Td>
                      <C.Td rowSpan={produto.itens.length}>{produto.perPureza}</C.Td>
                      <C.Td rowSpan={produto.itens.length}>{produto.vlrDensidade}</C.Td>
                    </>
                  )}
                  <C.Td>{item.datValidade}</C.Td>
                  <C.Td>{item.seqItem}</C.Td>
                  <C.Td>{item.qtdAtual}</C.Td>
                  <C.Td>
                    <C.Input
                      type="number"
                      defaultValue={item.qtdNova}
                      onChange={(e) =>
                        onQuantityChange(produto.codProduto, item.seqItem, e.target.value)
                      }
                    />
                  </C.Td>
                  <C.Td>
                    <QrCodeGenerationSelector
                      ref={qrCodeRef}  // Pass ref to each QrCodeGenerationSelector
                      codProduto={produto.codProduto}
                      seqItem={item.seqItem}
                      validade={item.datValidade}
                      produto={produto.nomProduto}
                      pureza={produto.perPureza}
                      densidade={produto.vlrDensidade}
                    />
                  </C.Td>
                </tr>
              );
            })}
          </React.Fragment>
        ))}
      </tbody>
    </C.Table>
  );
};

export default InventarioList;
