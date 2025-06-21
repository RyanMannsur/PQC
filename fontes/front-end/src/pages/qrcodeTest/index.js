import { useState } from "react";
import * as C from "./styles";
import RelatorioProdutos from "../../features/relatorio";
import { obterRelatorioProdutos } from "../../services/produto/service";



const QrCodeTest = () => {

  const QRCode = require('qrcode')

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
  })


  return (
    <C.Container>
      <h1>QrCode Test</h1>
      <C.FiltersContainer>

      </C.FiltersContainer>
    </C.Container>
  );
};


export default QrCodeTest;