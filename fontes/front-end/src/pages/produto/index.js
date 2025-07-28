import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import ProdutoForm from '../../features/produto';
import { Container, Table, Td, Th, Tr } from './styles';
import produtoService from '../../services/produto/service';


const ProdutoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Removido efeito de scroll para o topo ao editar

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


  // Scrolla para a div âncora ao clicar em Editar
  const handleEdit = (produto) => {
    setEditing(produto);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <h2 style={{ marginBottom: 32 }}>{editing ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
      <ProdutoForm
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
        isEditing={!!editing}
      />
      <h2 style={{ marginTop: 40 }}>Lista de Produtos</h2>
      <Table>
        <thead>
          <Tr>
            <Th>NCM</Th>
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
              <Td>{prod.ncm || '-'}</Td>
              <Td>{prod.nomProduto}</Td>
              <Td>{prod.nomLista}</Td>
              <Td>{prod.perPureza}</Td>
              <Td>{prod.vlrDensidade}</Td>
              <Td>{prod.idtAtivo ? 'Sim' : 'Não'}</Td>
              <Td>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(prod)}
                >Editar</Button>
                <Button variant="danger" size="small" onClick={() => handleDelete(prod.codProduto)} style={{ marginLeft: '8px' }}>Excluir</Button>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProdutoPage;
