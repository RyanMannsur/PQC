import { useState } from "react";
import * as C from "./styles";
import RelatorioProdutos from "../../features/relatorio";
import { obterRelatorioProdutos } from "../../services/produto/service";

const QrCodeTest = () => {

  const QRCode = require('qrcode')
  let Code = "";
  
  // Creating the data
  let data = {
    name: "Employee Name",
    age: 27,
    department: "Police",
    id: "aisuoiqu3234738jdhf100223"
  }

  // Converting the data into String format
  let stringdata = JSON.stringify(data)

  // Print the QR code to terminal
  QRCode.toString(stringdata, { type: 'terminal' },
    function (err, QRcode) {

      if (err) return console.log("error occurred")

      // Printing the generated code
      console.log(QRcode)
    })

  // Converting the data into base64 
  QRCode.toDataURL(stringdata, function (err, code) {
    if (err) return console.log("error occurred")

    // Printing the code
    console.log(code)
    Code = code
  })


  return (
    <C.Container>
      <h1>QrCode Test</h1>
      <C.FiltersContainer>
              <img src={Code} alt="Base64"/>
              <br></br>
              <input type="text "></input>
              <br></br>
              <button>GenerateQrCode</button>
              <button>ReadQRCode</button>
      </C.FiltersContainer>
    </C.Container>
  );
};

export default QrCodeTest;