import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../../../components/Input";
import Select from "../../../../components/InputSelect";
import Button from "../../../../components/Button";
import * as C from "./styles";
import { adicionarProduto } from "../../../../services/produto/service";

const CadastrarProduto = () => {
  const { id } = useParams(); // `id` será usado como codProduto
  const navigate = useNavigate();
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  const [justificativa, setJustificativa] = useState(""); // Ajustado para ser o texto da justificativa
  const [dataValidade, setDataValidade] = useState("");
  const [codigoEmbalagem, setCodigoEmbalagem] = useState(""); // Campo para código da embalagem
  const [mensagem, setMensagem] = useState("");
  const labInfo = JSON.parse(localStorage.getItem("labId")); // Obter informações do laboratório local

  // Opções do motivo
  const motivosOptions = [
    { value: "EC", label: "Compra" },
    { value: "ED", label: "Doação" },
    { value: "IN", label: "Inventário" },
  ];

  // Função de envio
  const handleSubmit = async () => {
    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!quantidade || !motivo || !justificativa || !dataValidade || !codigoEmbalagem) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    // Obter data atual
    const hoje = new Date().toISOString().split("T")[0];

    // Montar o payload
    const payload = {
      qtdEstoque: quantidade,
      idtTipoMovto: motivo,
      codEmbalagem: codigoEmbalagem, // Usar o código da embalagem
      datMovto: hoje,
      txtJustificativa: justificativa, // Texto da justificativa
      datValidade: dataValidade,
      codCampus: labInfo.codCampus,
      codUnidade: labInfo.codUnidade,
      codPredio: labInfo.codPredio,
      codLaboratorio: labInfo.codLaboratorio,
    };

    console.log("Payload enviado:", payload);

    try {
      // Chamar o serviço para enviar o produto
      const response = await adicionarProduto(id, payload); // `id` como codProduto
      console.log("Produto adicionado com sucesso:", response);
      navigate("/cadastrar-produto"); // Redirecionar após sucesso
    } catch (error) {
      console.error("Erro ao adicionar o produto:", error);
      setMensagem("Erro ao adicionar o produto. Tente novamente.");
    }
  };

  return (
    <C.Container>
      <h1>Cadastrar Produto</h1>
      <C.Content>
        {/* Input para Quantidade */}
        <C.Row>
          <Input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            label="Quantidade"
          />
        </C.Row>

        {/* Select para Motivo (sem label) */}
        <C.Row>
          <Select
            options={motivosOptions}
            value={motivo}
            onChange={(option) => setMotivo(option.value)}
            placeholder="Selecione o motivo"
          />
        </C.Row>

        {/* Input para Código da Embalagem */}
        <C.Row>
          <Input
            type="text"
            placeholder="Código da Embalagem"
            value={codigoEmbalagem}
            onChange={(e) => setCodigoEmbalagem(e.target.value)}
            label="Código da Embalagem"
          />
        </C.Row>

        {/* Input para Texto de Justificativa */}
        <C.Row>
          <Input
            type="text"
            placeholder="Justificativa"
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            label="Justificativa"
          />
        </C.Row>

        {/* Input para Data de Validade */}
        <C.Row>
          <Input
            type="date"
            placeholder="Data de Validade"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
            label="Data de Validade"
          />
        </C.Row>

        {/* Mensagem de erro */}
        {mensagem && <C.labelError>{mensagem}</C.labelError>}

        {/* Botão para Enviar */}
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
