import React, { useState, useContext } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth";

const Signin = () => {
  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!cpf || !senha) {
      setError("Preencha todos os campos");
      return;
    }

    const res = signin(cpf, senha);

    if (res) {
      setError(res);
      return;
    }

    navigate("/selecionar-lab");
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
        <Button Text="Entrar" onClick={handleLogin} fullWidth />
      </C.Content>
    </C.Container>
  );
};

export default Signin;
