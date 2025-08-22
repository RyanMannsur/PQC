import React from "react";
import { useImperativeHandle } from 'react';
import { forwardRef } from 'react';
import { useRef } from 'react';

const QrCodeGenerationSelector = forwardRef((props, ref) => {

  const {codProduto, seqItem, produto, densidade, pureza, validade} = props; 
  let checked = false; 
  


  const setChecked = () =>{
    checked = !checked
  }  

  const generateQrCode = () => {
    return 'Img'
  };


  let qrcodeData = {
    "QrCodeImg": generateQrCode(),
    "codProduto": codProduto,
    "seqItem": seqItem,
    "produto": produto,
    "densidade": densidade,
    "pureza": pureza,
    "validade": validade,
  }





  useImperativeHandle(ref, () => ({
    fetchQrCode(){
      window.alert('QrcodeFetched' + codProduto+ ':' +seqItem);
      console.log(qrcodeData)
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
