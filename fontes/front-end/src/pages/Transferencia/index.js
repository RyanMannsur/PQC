import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as C from "./styles";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ItemList from "../../components/ItemList";

const Transferencias = () => {
  const navigate = useNavigate();
  const [produto, setProduto] = useState("");
  const [pureza, setPureza] = useState("");
  const [densidade, setDensidade] = useState("");
  const [produtos, setProdutos] = useState([]);

  const handlePesquisar = () => {
    // Mock atualizado para refletir a nova estrutura
    const produtosMock = [
      {
        id: 1,
        codigo: "001",
        nome: "Ácido Sulfúrico",
        quantidade: "10L",
        validade: "2025-12-31",
        pureza: "98%",
        densidade: "1.84 g/cm³",
      },
      {
        id: 2,
        codigo: "002",
        nome: "Hidróxido de Sódio",
        quantidade: "5kg",
        validade: "2024-06-30",
        pureza: "99%",
        densidade: "2.13 g/cm³",
      },
      {
        id: 3,
        codigo: "003",
        nome: "Etanol",
        quantidade: "20L",
        validade: "2025-05-15",
        pureza: "96%",
        densidade: "0.789 g/cm³",
      },
      {
        id: 4,
        codigo: "004",
        nome: "Glicerina",
        quantidade: "8L",
        validade: "2025-03-22",
        pureza: "99.5%",
        densidade: "1.26 g/cm³",
      },
    ];

    setProdutos(produtosMock);
  };

  const handleTransferir = (item) => {
    navigate(`/transferir/${item.id}`);
  };

  const columns = [
    { key: "codigo", label: "Código", type: "string" },
    { key: "nome", label: "Nome", type: "string" },
    { key: "quantidade", label: "Quantidade", type: "string" },
    { key: "validade", label: "Data de Validade", type: "string" },
    { key: "pureza", label: "Pureza", type: "string" },
    { key: "densidade", label: "Densidade", type: "string" },
    {
      key: "transferencia",
      label: "Transferir",
      type: "button",
      onClick: handleTransferir,
    },
  ];

  const data = produtos.map((produto) => ({
    id: produto.id,
    codigo: produto.codigo,
    nome: produto.nome,
    quantidade: produto.quantidade,
    validade: produto.validade,
    pureza: produto.pureza,
    densidade: produto.densidade,
  }));

  return (
    <C.Container>
      <h1>Transferências</h1>

      <C.FilterContainer>
        <Input
          type="text"
          placeholder="Digite o produto"
          value={produto}
          label="Produto"
          onChange={(e) => setProduto(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Digite a pureza"
          value={pureza}
          label="Pureza"
          onChange={(e) => setPureza(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Digite a densidade"
          value={densidade}
          label="Densidade"
          onChange={(e) => setDensidade(e.target.value)}
        />
        <Button Text="Pesquisar" onClick={handlePesquisar} />
      </C.FilterContainer>

      {produtos.length > 0 ? (
        <ItemList columns={columns} data={data} />
      ) : (
        <p>Nenhum produto encontrado.</p>
      )}
    </C.Container>
  );
};

export default Transferencias;
