
import { useEffect, useState, useRef } from 'react';
import CrudTable from '../../components/CrudTable';
import ProdutoForm from '../../features/produto';
import { Container, TitleBottom } from './styles';
import produtoService from '../../services/produtoService';
import orgaoControleService from '../../services/orgaoControleService';
import { CAMPOS } from '../constants';
import { CircularProgress } from "@mui/material";

const ProdutoPage = () => {
  const [formKey, setFormKey] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const [orgaosControle, setOrgaosControle] = useState([])
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const editCancelText = editing ? 'Cancelar' : 'Limpar';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchProdutos();
    fetchOrgaosControle()
  }, []); 

  const fetchProdutos = async () => {
    try {
      setLoading(true)
      const response = await produtoService.listar();
      if (Array.isArray(response)) {
        setProdutos(response);
      } else {
        setStatusMessage(response)
      }
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false)
    }
  };

  const fetchOrgaosControle = async () => {
    try {
      setLoading(true)
      const response = await orgaoControleService.listar();
      if (Array.isArray(response)) {
        setOrgaosControle(response);
      } else {
        setStatusMessage(response)
      }
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false)
    }
  };

  //  função para gerenciar o estado dos checkboxes
  const handleOrgaoChange = (codOrgaoControle, isChecked) => {
    setFormData(prevFormData => {
      const currentOrgaos = prevFormData.orgaosControle || [];
      
      if (isChecked) {
        // Adiciona o objeto completo à lista
        const selectedOrgao = orgaosControle.find(o => o.codOrgaoControle === codOrgaoControle);
        return {
          ...prevFormData,
          orgaosControle: [...currentOrgaos, selectedOrgao]
        };
      } else {
        // Remove o objeto da lista
        return {
          ...prevFormData,
          orgaosControle: currentOrgaos.filter(o => o.codOrgaoControle !== codOrgaoControle)
        };
      }
    });
  };

  const handleCreate = async (produto) => {
    try {
      const response = await produtoService.cadastrar(produto);
      setStatusMessage(response)
      handleCancel();
      fetchProdutos();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } 
  };

  const handleUpdate = async (produto) => {
    try {
      const payload = { ...produto };
      if (!payload.codProduto && editing?.codProduto) {
        payload.codProduto = editing.codProduto;
      }
      const response = await produtoService.atualizar(payload);
      setStatusMessage(response)
      handleCancel();
      fetchProdutos();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } 
  };


  const handleDelete = async (produto) => {
    try {
      const response = await produtoService.excluir(produto.codProduto);
      setStatusMessage(response)
      fetchProdutos();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    };
  }

  const handleEdit = (produto) => {
    setFormData(produto); 
    setEditing(produto);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }


  const handleCancel = () => {
    setEditing(null);
    setFormData({})
    setFormKey(prev => prev + 1);
  };

  const handleCloseMessage = () => {
    setStatusMessage(null);
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{editing ? 'Editar Produto' : 'Cadastrar Produto'}</TitleBottom>
      <ProdutoForm
        key={formKey}
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
        isEditing={!!editing}
        allOrgaosControle={orgaosControle}
        handleOrgaoChange={handleOrgaoChange}
        onDelete={editing ? () => handleDelete(editing.codProduto) : undefined}
        onCancel={handleCancel}
        editCancelText={editCancelText}
        formData={formData}
        onChange={handleChange} 
      />
      {loading ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <CrudTable
          title="Lista de Produtos"
          columns={[
            { label: CAMPOS.NCM, field: 'ncm' },
            { label: CAMPOS.NOME, field: 'nomProduto' },
            { label: CAMPOS.LISTA, field: 'nomLista' },
            { label: CAMPOS.PUREZA, field: 'perPureza' },
            { label: CAMPOS.DENSIDADE, field: 'vlrDensidade' },
            { label: CAMPOS.ATIVO,
              render: (row) => (
                <input
                  type="checkbox"
                  checked={row.idtAtivo}
                />
              )
            }
          ]}
          data={produtos}
          onEdit={handleEdit}
          onDelete={handleDelete} 
          getRowKey={item => item.codProduto}
          statusMessage={statusMessage}
          onCloseMessage={handleCloseMessage}
        />
      )}  
    </Container>
  );
};

export default ProdutoPage;
