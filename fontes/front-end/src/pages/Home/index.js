import { useEffect, useContext, useState } from "react";
import * as C from "./styles";
import produtoService from "../../services/produtoService"
import { useNavigate } from "react-router-dom";
import StatusMessage from "../../components/StatusMensagem";



const Home = () => {
const navigate = useNavigate();
const [statusMessage, setStatusMessage] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchLabDetails = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
   
    if (!usuario)
       return;
    
    try {
      setLoading(true)
      const produtos = await produtoService.verificarSeTeveImplantacao(
        usuario.laboratorios[usuario.indCorrente].codCampus,
        usuario.laboratorios[usuario.indCorrente].codUnidade,
        usuario.laboratorios[usuario.indCorrente].codPredio,
        usuario.laboratorios[usuario.indCorrente].codLaboratorio
      );

      if (produtos.qtdItensImplantados === 0) {
        setStatusMessage({ tipo: 'AVISO', mensagem: ['Necessário realizar implantação dos produtos neste laboratório'] });
      }
    } catch (error) {
        const msg = 'Erro no servidor. ' + error;
        setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
      } finally {
        setLoading(false);
      }
  };

  fetchLabDetails();
}, []);

const onCloseMessage = () => {
  setStatusMessage(null);
  navigate("/implantacao"); 
};


return (
  <>
    {/* RENDERIZA O STATUS MESSAGE AQUI */}
    {statusMessage && (
      <StatusMessage
        message={statusMessage}
        onClose={onCloseMessage}
      />
    )}
  </>
);
};

export default Home;