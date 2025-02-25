import React, { useState } from "react";
import * as C from "./styles";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ItemList from "../../components/ItemList";

const Transferencias = () => {
  const [produto, setProduto] = useState("");
  const [pureza, setPureza] = useState("");
  const [densidade, setDensidade] = useState("");
  const [produtos, setProdutos] = useState([]);

  const handlePesquisar = () => {
    // Mock de dados apenas para exibição após a pesquisa
    const produtosMock = [
      {
        id: 1,
        codigo: "001",
        nome: "Ácido Sulfúrico",
        quantidade: "10L",
        validade: "2025-12-31",
        destino: "",
      },
      {
        id: 2,
        codigo: "002",
        nome: "Hidróxido de Sódio",
        quantidade: "5kg",
        validade: "2024-06-30",
        destino: "",
      },
      {
        id: 3,
        codigo: "003",
        nome: "Etanol",
        quantidade: "20L",
        validade: "2025-05-15",
        destino: "",
      },
      {
        id: 4,
        codigo: "004",
        nome: "Glicerina",
        quantidade: "8L",
        validade: "2025-03-22",
        destino: "",
      },
    ];

    setProdutos(produtosMock); // Atualiza a lista após a pesquisa
  };

  const destinos = [
    { value: "Lab A", label: "Lab A" },
    { value: "Lab B", label: "Lab B" },
    { value: "Lab C", label: "Lab C" },
  ];

  const handleInputChange = (rowIndex, key, value) => {
    const updatedData = produtos.map((produto, index) =>
      index === rowIndex ? { ...produto, [key]: value } : produto
    );
    setProdutos(updatedData); // Atualiza os dados com as modificações
  };

  const handleConfirmarTransferencia = (item) => {
    console.log("Confirmando transferência para:", item);
  };

  // Colunas conforme sua solicitação
  const columns = [
    { key: "codigo", label: "Código", type: "string" },
    { key: "nome", label: "Nome", type: "string" },
    { key: "quantidade", label: "Quantidade", type: "input" }, // Input para quantidade
    { key: "validade", label: "Data de Validade", type: "string" }, // Data normal
    {
      key: "destino",
      label: "Destino",
      type: "input",
      render: (item, rowIndex) => (
        <select
          value={item.destino}
          onChange={(e) =>
            handleInputChange(rowIndex, "destino", e.target.value)
          }
        >
          <option value="">Selecione</option>
          {destinos.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "button",
      label: "Confirmar Transferência",
      type: "button",
      onClick: handleConfirmarTransferencia, // Função que será chamada ao clicar
    },
  ];

  // Dados mockados para exibição
  const data = produtos.map((produto) => ({
    id: produto.id,
    codigo: produto.codigo,
    nome: produto.nome,
    quantidade: produto.quantidade,
    validade: produto.validade,
    destino: produto.destino,
  }));

  return (
    <C.Container>
      <h1>Transferências</h1>

      {/* Filtro com inputs e botão na mesma linha */}
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

      <C.ButtonGroup>
        <C.CancelButton onClick={() => window.location.reload()}>
          Cancelar
        </C.CancelButton>
      </C.ButtonGroup>
    </C.Container>
  );
};

export default Transferencias;
