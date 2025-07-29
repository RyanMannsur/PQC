
import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import ProdutoForm from '../../features/produto';
import { Container, Table, Td, Th, Tr, TitleBottom, TitleTop, ModalOverlay, ModalContent, TooltipError } from './styles';
import produtoService from '../../services/produto/service';
import { TEXTOS, CAMPOS } from './constantes';


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
    const token = localStorage.getItem('userToken');
    if (token) {
      fetchUsuario(token);
    }
  }, []);

  const fetchUsuario = async (token) => {
    try {
      const response = await fetch('http://localhost:8088/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error('Erro ao buscar usuário');
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      setUsuario({});
    }
  };

  const fetchProdutos = async () => {
    const res = await produtoService.listar();
    setProdutos(res.sort((a, b) => a.nomProduto.localeCompare(b.nomProduto)));
  };

  const handleCreate = async (produto) => {
    try {
      await produtoService.cadastrar(produto);
      setModalMessage(TEXTOS.PRODUTO_CADASTRADO_SUCESSO);
      setIsModalOpen(true);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_CADASTRAR_PRODUTO;
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };

  const handleUpdate = async (produto) => {
    try {
      const res = await produtoService.atualizar(produto);
      setModalMessage(TEXTOS.PRODUTO_ATUALIZADO_SUCESSO);
      setIsModalOpen(true);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_ATUALIZAR_PRODUTO;
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };


  const handleDelete = async (codProduto) => {
    if (window.confirm(TEXTOS.CONFIRMA_EXCLUSAO)) {
      await produtoService.excluir(codProduto);
      fetchProdutos();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.reload();
  };


  const handleEdit = (produto) => {
    setEditing(produto);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{editing ? TEXTOS.EDITAR_PRODUTO : TEXTOS.CADASTRAR_PRODUTO}</TitleBottom>
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
            <Th>{CAMPOS.NCM}</Th>
            <Th>{CAMPOS.NOME}</Th>
            <Th>{CAMPOS.LISTA}</Th>
            <Th>{CAMPOS.PUREZA}</Th>
            <Th>{CAMPOS.DENSIDADE}</Th>
            <Th>{CAMPOS.ATIVO}</Th>
            <Th>{CAMPOS.ACOES}</Th>
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
              <Td>{prod.idtAtivo ? TEXTOS.SIM : TEXTOS.NAO}</Td>
              <Td>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(prod)}
                >{TEXTOS.EDITAR}</Button>
                {/* Botão de excluir removido da tabela, permanece apenas no formulário de edição */}
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>{TEXTOS.SUCESSO}</h3>
            <p>{modalMessage}</p>
            <Button variant="primary" onClick={handleModalClose}>{TEXTOS.OK}</Button>
          </ModalContent>
        </ModalOverlay>
      )}
      {tooltip.visible && (
        <TooltipError>
          <strong>{TEXTOS.ERRO}</strong> {tooltip.message}
        </TooltipError>
      )}
    </Container>
  );
};

export default ProdutoPage;
