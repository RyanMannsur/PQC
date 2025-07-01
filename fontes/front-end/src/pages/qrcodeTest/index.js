import { useState } from "react";
import * as C from "./styles";
import { Update } from "@mui/icons-material";
import QrReader from "react-qr-reader-es6"

const QrCodeTest = () => {

  const QRCode = require('qrcode')
  const [code, setQrcodeImage] = useState(0);
  const [inputValue, setInputValue] = useState('')

  function PrintQRCodeTerminal(stringdata) {
    // Print the QR code to terminal
    QRCode.toString(stringdata, { type: 'terminal' },
      function (err, QRcode) {
        if (err) return console.log("error occurred")
        // Printing the generated code
        console.log(QRcode)
      })
  }

  // Converting the data into base64 
  function GenerateQRCodeImage(stringdata) {
    QRCode.toDataURL(stringdata, { errorCorrectionLevel: 'H' }, function (err, newCode) {
      if (err) return console.log("error occurred")
      // Printing the code
      setQrcodeImage(newCode)
    })
  }

  function updateQrcode() {
    console.log(inputValue);
    // Converting the data into String format
    let stringdata = JSON.stringify(inputValue)
    GenerateQRCodeImage(stringdata)

    //PrintQRCodeTerminal(data)
  }

  function handleScan() {
    console.log(data)
  }

  function  handleError() {
    console.error(err)
  }

  return (
    <C.Container>
      <h1>QrCode Test</h1>
      <C.FiltersContainer>
        <img src={code} alt="QrCode" />
        <br></br>
        <input
          type="text" value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        ></input>
        <br></br>
        <button
          onClick={updateQrcode}
        >Generate QrCode</button>
        
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      
      </C.FiltersContainer>
    </C.Container>
  );
};

export default QrCodeTest;