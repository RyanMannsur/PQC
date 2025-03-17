import React, { useState, useEffect } from "react";
import * as C from "./styles";
import ItemList from "../../../components/ItemList";
import { obterProdutos } from "../../../services/produto/service";
import { useNavigate } from "react-router-dom";

const CreateProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchProdutos = async () => {
        const produtosResponse = await obterProdutos();
        setProdutos(produtosResponse);
      };
  
      fetchProdutos();
    }, []);
  
    const handleActionClick = (id, key) => {
      console.log("Ação clicada para o item com ID:", id);
      navigate(`/cadastrar-produto/${id}`);
    };
  
    const columns = [
      { key: "nome", label: "Nome", type: "string" },
      { key: "lista", label: "Lista", type: "string" },
      { key: "pureza", label: "Pureza", type: "string" },
      { key: "densidade", label: "Densidade", type: "string" },
      {
        key: "acoes",
        label: "Ações",
        type: "button",
      },
    ];
  
    const data = produtos
      .map((produto) => ({
        id: produto[0],
        nome: produto[1],
        lista: produto[2],
        pureza: produto[3],
        densidade: produto[4],
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  
    return (
      <C.Container>
        <h1>Cadastrar Produtos</h1>
  
        {produtos.length > 0 ? (
          <ItemList
            columns={columns}
            data={data}
            onActionClick={handleActionClick}
          />
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </C.Container>
    );
  };
  
  export default CreateProdutos;