import React from "react";
import Button from "../../../components/Button";

function PrintarQrCodes(funcao){
  funcao();
  window.console.log("generatingQrCodes")    
}

const QrCodePrintButton = ({fetchQrFunction}) => {
  return (
      <Button Text="GerarQrCodes" onClick={()=>{PrintarQrCodes(fetchQrFunction)}} />
  );
};

export default QrCodePrintButton;
