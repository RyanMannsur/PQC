import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../../../components/Input";
import Select from "../../../../components/InputSelect";
import Button from "../../../../components/Button";
import * as C from "./styles";
import { adicionarProdutos } from "../../../../services/produto/service";


const CadastrarProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantidadeEmbalagens, setQuantidadeEmbalagens] = useState("");
  const [motivo, setMotivo] = useState("");
  const [quantidades, setQuantidades] = useState([]);
  const [codigosEmbalagem, setCodigosEmbalagem] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const labInfo = JSON.parse(localStorage.getItem("labId"));

  const motivosOptions = [
    { value: "EC", label: "Compra" },
    { value: "ED", label: "Doação" },
    { value: "IN", label: "Inventário" },
  ];

  useEffect(() => {
    setQuantidades(Array(Number(quantidadeEmbalagens)).fill(""));
    setCodigosEmbalagem(Array(Number(quantidadeEmbalagens)).fill(""));
  }, [quantidadeEmbalagens]);

  const handleQuantidadeChange = (index, value) => {
    const newQuantidades = [...quantidades];
    newQuantidades[index] = value;
    setQuantidades(newQuantidades);
  };

  const handleCodigoEmbalagemChange = (index, value) => {
    const newCodigosEmbalagem = [...codigosEmbalagem];
    newCodigosEmbalagem[index] = value;
    setCodigosEmbalagem(newCodigosEmbalagem);
  };

  const handleSubmit = async () => {
    if (!quantidadeEmbalagens || !motivo || quantidades.includes("") || codigosEmbalagem.includes("")) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    const produtos = quantidades.map((quantidade, index) => ({
      codProduto: id,
      qtdEstoque: quantidade,
      idtTipoMovto: motivo,
      codEmbalagem: codigosEmbalagem[index],
      // Adicione outros campos necessários aqui
    }));

    const payload = produtos.map((produto) => ({
      codCampus: labInfo.codCampus,
      codUnidade: labInfo.codUnidade,
      codPredio: labInfo.codPredio,
      codLaboratorio: labInfo.codLaboratorio,
      ...produto,
    }));

    console.log("Payload a ser enviado:", payload);

    try {
      const response = await adicionarProdutos(payload);
      console.log("Produtos adicionados:", response);
      navigate("/cadastrar-produto");
    } catch (error) {
      console.error("Erro ao adicionar produtos:", error);
      setMensagem("Erro ao adicionar produtos.");
    }
  };

  return (
    <C.Container>
      <h1>Cadastrar Produto</h1>
      <C.Content>
        <C.Row>
          <Input
            type="number"
            placeholder="Quantidade de embalagens"
            value={quantidadeEmbalagens}
            onChange={(e) => setQuantidadeEmbalagens(e.target.value)}
            label="Quantidade de embalagens"
          />
          <div>
            <C.Label>Motivo</C.Label>
            <Select
              options={motivosOptions}
              value={motivo}
              onChange={(option) => setMotivo(option.value)}
              placeholder="Motivo"
            />
          </div>
        </C.Row>
        {quantidades.map((quantidade, index) => (
          <C.Row key={index}>
            <Input
              type="number"
              placeholder={`Quantidade Produto ${index + 1}`}
              value={quantidade}
              onChange={(e) => handleQuantidadeChange(index, e.target.value)}
              label={`Quantidade Produto ${index + 1}`}
            />
            <Input
              type="text"
              placeholder={`Código Embalagem ${index + 1}`}
              value={codigosEmbalagem[index]}
              onChange={(e) => handleCodigoEmbalagemChange(index, e.target.value)}
              label={`Código Embalagem ${index + 1}`}
            />
          </C.Row>
        ))}
        <C.labelError>{mensagem}</C.labelError>
        <Button
          Text="Confirmar"
          onClick={handleSubmit}
          Type="button"
          disabled={!quantidadeEmbalagens || !motivo || quantidades.includes("") || codigosEmbalagem.includes("")}
        />
      </C.Content>
    </C.Container>
  );
};

export default CadastrarProduto;