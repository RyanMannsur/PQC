
import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import CrudTable from '../../components/CrudTable';
import ProdutoForm from '../../features/produto';
import { Container, TitleBottom, ModalOverlay, ModalContent, TooltipError } from './styles';
import produtoService from '../../services/produto/service';
import { TEXTOS, CAMPOS } from './constantes';


const ProdutoPage = () => {
  const [formKey, setFormKey] = useState(0);
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
      const payload = { ...produto };
      if (!payload.codProduto && editing?.codProduto) {
        payload.codProduto = editing.codProduto;
      }
      await produtoService.atualizar(payload);
      setEditing(null);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_ATUALIZAR_PRODUTO;
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };


  const handleDelete = async (codProduto) => {
    await produtoService.excluir(codProduto);
    window.location.reload();
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

  const handleCancel = () => {
    setEditing(null);
    setFormKey(prev => prev + 1);
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{editing ? TEXTOS.EDITAR_PRODUTO : TEXTOS.CADASTRAR_PRODUTO}</TitleBottom>
      <ProdutoForm
        key={formKey}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
        isEditing={!!editing}
        isADM={usuario?.isADM}
        onDelete={editing && usuario?.isADM ? () => handleDelete(editing.codProduto) : undefined}
        onCancel={handleCancel}
      />
      <CrudTable
        title="Lista de Produtos"
        columns={[
          { label: CAMPOS.NCM, field: 'ncm' },
          { label: CAMPOS.NOME, field: 'nomProduto' },
          { label: CAMPOS.LISTA, field: 'nomLista' },
          { label: CAMPOS.PUREZA, field: 'perPureza' },
          { label: CAMPOS.DENSIDADE, field: 'vlrDensidade' },
          { label: CAMPOS.ATIVO, field: 'idtAtivo', render: v => v ? TEXTOS.SIM : TEXTOS.NAO }
        ]}
        data={produtos}
        onEdit={handleEdit}
        editText={TEXTOS.EDITAR}
        getRowKey={item => item.codProduto}
        renderActions={undefined}
      />
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
