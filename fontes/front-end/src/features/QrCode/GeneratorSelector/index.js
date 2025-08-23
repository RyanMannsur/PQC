import React from "react";
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';

const QrCodeGenerationSelector = forwardRef((props, ref) => {
  
  const {codProduto, seqItem, produto, densidade, pureza, validade} = props; 
  let checked = false; 
  
  const setChecked = () =>{
    checked = !checked
  }  

  const generateQrCode = (stringData) =>{
    const QRCode = require('qrcode');
    
    QRCode.toDataURL(stringData, { errorCorrectionLevel: 'H' }, function (err, qrCode) {
      if (err) return console.log("error occurred");
      qrcodeData.QrCodeImg = qrCode;
    })
  }

  let qrCodeInfo = {
    "codProduto": codProduto,
    "seqItem": seqItem,
    "produto": produto,
    "densidade": densidade,
    "pureza": pureza,
    "validade": validade,
  }
  let qrcodeData = {"QrCodeImg": '',}

  useImperativeHandle(ref, () => ({
    fetchQrCode(){
      generateQrCode(JSON.stringify(qrCodeInfo));
      qrcodeData = Object.assign({}, qrCodeInfo, qrcodeData);
      console.log(qrcodeData);
      return qrcodeData;
    },
    isChecked(){
      return checked;
    }
  }));

  return (
    <input type="checkbox" className="QrCodeSelector" onChange={setChecked}></input>
  );
});

export default QrCodeGenerationSelector;
