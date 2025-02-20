import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import * as C from "./styles";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Signin = () => {
  const { signin } = useAuth();
  const navigate = useNavigate();

  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!cpf) {
      setError("Preencha todos os campos");
      return;
    }

    const res = signin(cpf);

    if (res) {
      setError(res);
      return;
    }

    localStorage.setItem("user_cpf", cpf);
    navigate("/selecionar-lab");
  };

  return (
    <C.Container>
      <C.Label>SISTEMA DOS PRODUTOS QUIMICOS CONTROLADOS</C.Label>
      <C.Content>
        <Input
          type="cpf"
          placeholder="Digite seu cpf"
          value={cpf}
          onChange={(e) => [setCpf(e.target.value), setError("")]}
        />
        <C.labelError>{error}</C.labelError>
        <Button Text="Entrar" onClick={handleLogin} />
      </C.Content>
    </C.Container>
  );
};

export default Signin;
