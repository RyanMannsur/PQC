import { useState, useContext } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

const Signin = () => {
  const navigate = useNavigate();
  const { signin } = useContext(AuthContext);

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleLogin = async () => {
    if (!cpf || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    //########################################################
    // Chamar aqui a api do sigaa para validar senha
    //########################################################
    
    setLoading(true);
    setError("");

    const authError = await signin(cpf);

    setLoading(false);

    if (authError) {
      setError(authError);
    } else {
      navigate("/home");
    }      
  };

  return (
    <C.Container>
      <C.Label>ENTRAR NO SISTEMA</C.Label>
      <C.Content>
        <Input
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          label="Usuário:"
          onChange={(e) => [setCpf(e.target.value), setError("")]} 
        />
        <Input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          label="Senha:"
          onChange={(e) => [setSenha(e.target.value), setError("")]} 
        />
        <C.labelError>{error}</C.labelError>
        <div>*Utilizar as mesmas credenciais do SIGAA</div>
        <Button 
          Text={loading ? "Entrando..." : "Entrar"} 
          onClick={handleLogin} 
          $fullWidth 
          disabled={loading}
        />
        <Button
          Text="Manual do Sistema"
          $variant="secondary"
          style={{ marginTop: 16 }}
          onClick={() => navigate('/manual')}
          $fullWidth
        />
      </C.Content>
    </C.Container>
  );
};

export default Signin;
