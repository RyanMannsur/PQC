import { useEffect, useState, useRef } from 'react';
import CrudTable from '../../components/CrudTable';
import CampusForm from '../../features/campus';
import { Container, TitleBottom } from './styles';
import campusService from '../../services/campusService';
import { CAMPOS } from '../constants';
import { CircularProgress } from "@mui/material";

const CampusPage = () => {
  const [formKey, setFormKey] = useState(0);
  const [campi, setCampi] = useState([]);
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

  const fetchCampi = async () => {
    try {
      setLoading(true);
      const response = await campusService.listar();
      if (Array.isArray(response)) {
        setCampi(response);
      } else {
        setStatusMessage(response);
      }
    } catch (error) {
      const msg = 'Erro no servidor. ' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampi();
  }, []);

  const handleCreate = async (campus) => {
    try {
      const response = await campusService.cadastrar(campus);
      setStatusMessage(response);
      handleCancel();
      fetchCampi();
    } catch (error) {
      const msg = 'Erro no servidor. ' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    }
  };

  const handleUpdate = async (campus) => {
    try {
      const response = await campusService.alterar(campus);
      setStatusMessage(response);
      handleCancel();
      fetchCampi();
    } catch (error) {
      const msg = 'Erro no servidor. ' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    }
  };

  const handleDelete = async (campus) => {
    try {
      const response = await campusService.excluir(campus.codCampus);
      setStatusMessage(response);
      fetchCampi();
    } catch (error) {
      const msg = 'Erro no servidor. ' + error;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    }
  };

  const handleEdit = (campus) => {
    setFormData(campus || {}); 
    setEditing(campus || null);
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
      <TitleBottom>{editing ? 'Editar Campus' : 'Cadastrar Campus'}</TitleBottom>

      <CampusForm
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
          title="Lista de Campi"
          columns={[
            { label: CAMPOS.CODCAMPUS, field: 'codCampus' },
            { label: CAMPOS.NOMCAMPUS, field: 'nomCampus' }
          ]}
          data={campi}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getRowKey={item => item.codCampus}
          statusMessage={statusMessage}
          onCloseMessage={handleCloseMessage}
        />
      )}
    </Container>
  );
};

export default CampusPage;
