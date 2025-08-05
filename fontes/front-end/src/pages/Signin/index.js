import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/auth/service";

const Signin = () => {
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!cpf || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData = await login(cpf, senha);
      
      if (userData.laboratorios && userData.laboratorios.length > 0) {
        const firstLab = userData.laboratorios[0];
        localStorage.setItem("labId", JSON.stringify({
          codCampus: firstLab.codCampus,
          codUnidade: firstLab.codUnidade,
          codPredio: firstLab.codPredio,
          codLaboratorio: firstLab.codLaboratorio,
          nomLocal: firstLab.nomLocal
        }));
      }

      navigate("/selecionar-lab");
    } catch (err) {
      setError(err.message || "Erro no login");
    } finally {
      setLoading(false);
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
