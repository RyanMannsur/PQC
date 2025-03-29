import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../../../components/Input";
import Select from "../../../../components/InputSelect";
import Button from "../../../../components/Button";
import * as C from "./styles";
import { adicionarProduto } from "../../../../services/produto/service";

const CadastrarProduto = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  const [justificativa, setJustificativa] = useState(""); 
  const [dataValidade, setDataValidade] = useState("");
  const [codigoEmbalagem, setCodigoEmbalagem] = useState(""); 
  const [mensagem, setMensagem] = useState("");
  const labInfo = JSON.parse(localStorage.getItem("labId")); 

  // Opções do motivo
  const motivosOptions = [
    { value: "EC", label: "Compra" },
    { value: "ED", label: "Doação" },
  ];

  const handleSubmit = async () => {
    if (!quantidade || !motivo || !justificativa || !dataValidade || !codigoEmbalagem) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    const hoje = new Date().toISOString().split("T")[0];
    const payload = {
      qtdEstoque: quantidade,
      idtTipoMovto: motivo,
      codEmbalagem: codigoEmbalagem,
      datMovto: hoje,
      txtJustificativa: justificativa,
      datValidade: dataValidade,
      codCampus: labInfo.codCampus,
      codUnidade: labInfo.codUnidade,
      codPredio: labInfo.codPredio,
      codLaboratorio: labInfo.codLaboratorio,
    };

    console.log("Payload enviado:", payload);

    try {
      const response = await adicionarProduto(id, payload); 
      console.log("Produto adicionado com sucesso:", response);
      navigate("/cadastrar-produto");
    } catch (error) {
      console.error("Erro ao adicionar o produto:", error);
      setMensagem("Erro ao adicionar o produto. Tente novamente.");
    }
  };

  return (
    <C.Container>
      <h1>Cadastrar Produto</h1>
      <C.Content>
        <C.Row>
          <Input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            label="Quantidade"
          />
        </C.Row>

        <C.Row>
          <Select
            options={motivosOptions}
            value={motivo}
            onChange={(option) => setMotivo(option.value)}
            placeholder="Selecione o motivo"
          />
        </C.Row>

        <C.Row>
          <Input
            type="text"
            placeholder="Código da Embalagem"
            value={codigoEmbalagem}
            onChange={(e) => setCodigoEmbalagem(e.target.value)}
            label="Código da Embalagem"
          />
        </C.Row>

        <C.Row>
          <Input
            type="text"
            placeholder="Justificativa"
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            label="Justificativa"
          />
        </C.Row>

        <C.Row>
          <Input
            type="date"
            placeholder="Data de Validade"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
            label="Data de Validade"
          />
        </C.Row>

        {mensagem && <C.labelError>{mensagem}</C.labelError>}

        <Button
          Text="Confirmar"
          onClick={handleSubmit}
          Type="button"
          disabled={!quantidade || !motivo || !justificativa || !dataValidade || !codigoEmbalagem}
        />
      </C.Content>
    </C.Container>
  );
};

export default CadastrarProduto;
