import { useEffect, useState } from 'react';
import ProdutoForm from '../../features/produto';
import { Container, Table, Td, Th, Tr, Button } from './styles';
import produtoService from '../../services/produto/service';


const ProdutoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchProdutos = async () => {
    const res = await produtoService.listar();
    setProdutos(res);
  };

  const handleCreate = async (produto) => {
    await produtoService.cadastrar(produto);
    fetchProdutos();
  };

  const handleUpdate = async (produto) => {
    await produtoService.atualizar(produto);
    setEditing(null);
    fetchProdutos();
  };

  const handleDelete = async (codProduto) => {
    if (window.confirm('Deseja realmente excluir?')) {
      await produtoService.excluir(codProduto);
      fetchProdutos();
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <Container>
      <h2>{editing ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
      <ProdutoForm
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
        isEditing={!!editing}
      />
      <h2>Lista de Produtos</h2>
      <Table>
        <thead>
          <Tr>
            <Th>Código</Th>
            <Th>Nome</Th>
            <Th>Lista</Th>
            <Th>Pureza</Th>
            <Th>Densidade</Th>
            <Th>Ativo</Th>
            <Th>Ações</Th>
          </Tr>
        </thead>
        <tbody>
          {produtos.map(prod => (
            <Tr key={prod.codProduto}>
              <Td>{prod.codProduto}</Td>
              <Td>{prod.nomProduto}</Td>
              <Td>{prod.nomLista}</Td>
              <Td>{prod.perPureza}</Td>
              <Td>{prod.vlrDensidade}</Td>
              <Td>{prod.idtAtivo ? 'Sim' : 'Não'}</Td>
              <Td>
                <Button onClick={() => setEditing(prod)}>Editar</Button>
                <Button onClick={() => handleDelete(prod.codProduto)}>Excluir</Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProdutoPage;

