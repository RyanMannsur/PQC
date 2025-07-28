import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import ProdutoForm from '../../features/produto';
import { Container, Table, Td, Th, Tr } from './styles';
import produtoService from '../../services/produto/service';


const ProdutoPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, message: "" });

  useEffect(() => {
    fetchProdutos();
    const token = localStorage.getItem('token');
    if (token) {
      fetchUsuario(token);
    }
  }, []);

  const fetchUsuario = async (token) => {
    try {
      const response = await fetch('/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (response.ok) {
        const data = await response.json();
        setUsuario(data);
      } else {
        setUsuario({});
      }
    } catch {
      setUsuario({});
    }
  };

  // Removido efeito de scroll para o topo ao editar

  const fetchProdutos = async () => {
    const res = await produtoService.listar();
    // Ordena por nome
    setProdutos(res.sort((a, b) => a.nomProduto.localeCompare(b.nomProduto)));
  };

  const handleCreate = async (produto) => {
    try {
      const res = await produtoService.cadastrar(produto);
      setModalMessage("Produto cadastrado com sucesso!");
      setIsModalOpen(true);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || "Erro ao cadastrar produto.";
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };

  const handleUpdate = async (produto) => {
    try {
      const res = await produtoService.atualizar(produto);
      setModalMessage("Produto atualizado com sucesso!");
      setIsModalOpen(true);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || "Erro ao atualizar produto.";
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };


  const handleDelete = async (codProduto) => {
    if (window.confirm('Deseja realmente excluir?')) {
      await produtoService.excluir(codProduto);
      fetchProdutos();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.reload();
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
        isADM={usuario?.isADM}
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
                {usuario?.isADM && (
                  <Button variant="danger" size="small" onClick={() => handleDelete(prod.codProduto)} style={{ marginLeft: '8px' }}>Excluir</Button>
                )}
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {/* Modal de sucesso */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <h3>Sucesso</h3>
            <p>{modalMessage}</p>
            <Button variant="primary" onClick={handleModalClose}>OK</Button>
          </div>
        </div>
      )}
      {/* Tooltip de erro */}
      {tooltip.visible && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#e74c3c', color: '#fff', padding: '12px 24px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 9999 }}>
          <strong>Erro:</strong> {tooltip.message}
        </div>
      )}
    </Container>
  );
};

export default ProdutoPage;
