import { useEffect, useState, useRef } from 'react';
import usuarioService from '../../services/usuarioService';
import { Container, TitleBottom } from './styles';
import CrudTable from '../../components/CrudTable';
import UsuarioForm from '../../features/usuario'; 
import { CircularProgress } from "@mui/material";
import { CAMPOS } from '../constants';

const UsuarioPage = () => {
  const [formKey, setFormKey] = useState(0);
  const [usuarios, setUsuarios] = useState([]);
  const [editing, setEditing] = useState(null); 
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const response = await usuarioService.listar();
      if (Array.isArray(response)) {
        setUsuarios(response);
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

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleCreate = async (usuario)=> {
    try {
      const response = await usuarioService.cadastrar(usuario)
      setStatusMessage(response)
      handleCancel()
      fetchUsuarios();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } 
  };

  const handleUpdate = async (usuario) => {
    try {
      const response = await usuarioService.alterar(usuario);
      setStatusMessage(response)
      handleCancel(); 
      fetchUsuarios();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({tipo: 'ERRO', mensagem: [msg] });
    } 
  };

  const handleDelete = async (usuario) => {
    try {
      const response = await usuarioService.excluir(usuario.codCPF);
      setStatusMessage(response)
      setEditing(null);
      fetchUsuarios();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({tipo: 'ERRO', mensagem: [msg] });
    } 
  };

  const handleEdit = (usuario) => {
    setFormData(usuario); 
    setEditing(usuario);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setFormKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({}); 
    setFormKey(prev => prev + 1);
  };

  const handleCloseMessage = () => {
    setStatusMessage(null);
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{editing ? 'Editar Usuário' : 'Cadastrar Usuário'}</TitleBottom>
      <UsuarioForm
        key={formKey}
        onSubmit={editing ? handleUpdate : handleCreate}
        onChange={handleChange}
        isEditing={!!editing}
        onCancel={handleCancel}
        formData={formData}
      />

      {loading ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
      <CrudTable
        title="Lista de Usuários"
        columns={[
          { label: CAMPOS.CODCPF, field: 'codCPF' },
          { label: CAMPOS.NOMUSUARIO, field: 'nomUsuario' },
          { label: CAMPOS.TIPOUSUARIO, field: 'idtTipoUsuario' }
        ]}
        data={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={item => item.codCPF}
        statusMessage={statusMessage}
        onCloseMessage={handleCloseMessage}
      />
     )}
    </Container>
  );
};

export default UsuarioPage;