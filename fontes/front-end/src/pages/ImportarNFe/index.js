import { useState, useRef,  useEffect } from 'react';
import Button from "../../components/Button";
import * as C from "./styles";

import importarNFEService from '../../services/importarNFEService.js';
import { CircularProgress } from "@mui/material";
import StatusMessage from "../../components/StatusMensagem";

const ImportarNFe = () => {
  // Estado para armazenar o arquivo selecionado
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSemLab, setIsSemLab] = useState(false);
  
  // Use useEffect para buscar o usuário quando o componente for montado
  useEffect(() => {
      const usuario = JSON.parse(localStorage.getItem("usuario"))
      setUsuario(usuario);
      if (!usuario) {
        setStatusMessage({ tipo: 'ERRO', mensagem: ['Erro ao acessar dados do usuário'] });
        setIsSemLab(true)
        return;
      }
      const lab = usuario.laboratorios[usuario.indCorrente]
      if (lab.codCampus === null) {
        setStatusMessage({ tipo: 'AVISO', mensagem: ['Usuario não está como responsável de nenhum laboratório'] });
        setLoading(false);
        setIsSemLab(true)
        return;
      }
      setIsSemLab(false)
  }, []);

  // Função para abrir a caixa de diálogo de arquivos
  const handleSelectFile = () => {
    fileInputRef.current.click();
  };

  // Função chamada quando um arquivo é selecionado
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/xml") {
      setFile(selectedFile);
    } else {
      setFile(null);
      setStatusMessage({ tipo: 'AVISO', mensagem: ['selecione um arquivo XML'] });
      return;
    }
  };

  
  const handleReceiveProducts = async () => {
    if (!file || !usuario) {
      setStatusMessage({ tipo: 'AVISO', mensagem: ['selecione um arquivo'] });
      return;
    }

    const reader = new FileReader();
      reader.onload = async (e) => {
      const xmlContent = e.target.result;
        
      const payload = {
          'codCampus': usuario.codCampusAtu,
          'codUnidade': usuario.codUnidadeAtu,
          'codPredio': usuario.codPredioAtu,
          'codLaboratorio': usuario.codLaboratorioAtu,
          'nfeXML': xmlContent
      }
        
      try {
          // Chamar a função do seu serviço de NFe para importar o arquivo
          const response = await importarNFEService.importarNFe(payload);

          if (Array.isArray(response)) {
            setFile(null); 
          } else {
             setStatusMessage(response);
          }
        } catch (error) {
             const msg = 'Erro no servidor. ' + error;
             setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
        } finally {
          setLoading(false);
        }
    }
    reader.readAsText(file) 
  };

  const handleCloseMessage = () => {
    setStatusMessage(null);
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
      <C.Container><h2 style={{ textAlign: 'center' }}>Importar NFe</h2>
        
        <p>Selecione um arquivo XML de NFe para importar.</p>

        {/* Input de arquivo oculto */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".xml"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Botão para abrir a caixa de diálogo de arquivos */}
          <Button 
            Text="Selecionar Arquivo"
            onClick={handleSelectFile}
            disabled={isSemLab}
            size="medium"
          />

          {/* Exibe o nome do arquivo selecionado */}
          {file && <p><b>Arquivo selecionado:</b> {file.name}</p>}
        </div>

        <C.ButtonGroup>
          {/* Botão para enviar o arquivo para processamento */}
          <Button
            Text="Receber Produtos"
            onClick={handleReceiveProducts}
            size="large"
            $fullWidth
            disabled={!file} // Desabilita o botão se nenhum arquivo for selecionado
          />
        </C.ButtonGroup>
      </C.Container>
       )}
      {/* RENDERIZA O STATUS MESSAGE AQUI */}
      {statusMessage && (
        <StatusMessage
          message={statusMessage}
          onClose={handleCloseMessage}
        />
      )}
    </>
  );
};

export default ImportarNFe;