// src/pages/OrgaoControle.js
import { useEffect, useState, useRef } from 'react';
import CrudTable from '../../components/CrudTable';
import OrgaoControleForm from '../../features/OrgaoControle';
import { Container, TitleBottom } from './styles';
import orgaoControleService from '../../services/orgaoControleService';
import { CAMPOS } from '../constants';
import { CircularProgress } from "@mui/material";

const OrgaoControlePage= () => {
  const [formKey, setFormKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [orgaoControle, setOrgaoControle] = useState([]);
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const fetchOrgaos = async () => {
    try {
      setLoading(true);
      const response = await orgaoControleService.listar();
       if (Array.isArray(response)) {
        setOrgaoControle(response);
      } else {
        setStatusMessage(response)
      }
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({
        tipo: 'ERRO',
        mensagem: [msg],
      });
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchOrgaos();
  }, []);

  const handleCreate = async (data) => {
    try {
      const response = await orgaoControleService.cadastrar(data);
      setEditing(null);
      setStatusMessage(response)
      handleCancel()
      fetchOrgaos();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({
        tipo: 'ERRO',
        mensagem: [msg],
      });
    }
  };

  const handleUpdate = async (data) => {
    try {
      const response = await orgaoControleService.alterar(data);
      setStatusMessage(response)
      setEditing(null);
      setFormData({}); 
      fetchOrgaos();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({
        tipo: 'ERRO',
        mensagem: [msg],
      });
    }
  };

  const handleDelete = async (codOrgaoControle) => {
    try {
      const response = await orgaoControleService.excluir(codOrgaoControle);
      setStatusMessage(response)
      fetchOrgaos();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({
        tipo: 'ERRO',
        mensagem: [msg],
      });
    }
  };


  const handleEdit = (orgao) => {
    setFormData(orgao || {}); 
    setEditing(orgao || null);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setFormKey(prev => prev + 1);
  };


  const handleCancel = () => {
    setFormData({});
    setEditing(null);
    setFormKey(prev => prev + 1);
  };
   
  const handleCloseMessage = () => {
    setStatusMessage(null);
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{editing ? 'Editar Orgão de Controle' : 'Cadastrar Orgão de Controle'}</TitleBottom>
      <OrgaoControleForm
        key={formKey}
        onSubmit={editing ? handleUpdate : handleCreate}
        isEditing={!!editing}
        onDelete={handleDelete}
        onCancel={handleCancel}
        formData={formData}
        onChange={handleChange}
      />
      
      {loading ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <CircularProgress />
        </div>
      ) : (

        <CrudTable
          title="Lista de Orgãos de Controle"
          columns={[{ label: CAMPOS.NOMORGAOCONTROLE, field: 'nomOrgaoControle' }]}
          data={orgaoControle}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getRowKey={item => item.codOrgaoControle}
          statusMessage={statusMessage}
          onCloseMessage={handleCloseMessage}
        />
      )}
    </Container>
  );
};

export default OrgaoControlePage;