import { useState, useEffect, useRef } from 'react';
import UnidadeOrganizacionalForm from '../../features/unidadeOrganizacional';
import unidadeOrganizacionalService from '../../services/unidadeOrganizacionalService';
import campusService from '../../services/campusService';
import CrudTable from '../../components/CrudTable';
import { CAMPOS } from '../constants';
import { Container, TitleBottom } from './styles';
import { CircularProgress } from "@mui/material";

const UnidadeOrganizacionalPage = () => {
  const [formKey, setFormKey] = useState(0);
  const [unidades, setUnidades] = useState([]);
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
        setStatusMessage(response)
      }
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

const fetchUnidades = async () => {
    try {
      setLoading(true);
      const response = await unidadeOrganizacionalService.listar();
      if (Array.isArray(response)) {
        setUnidades(response)
      } else {
        setStatusMessage(response)
      }
    } catch (error) {
       const msg = 'Erro no servidor.' + error;
      setStatusMessage({
        tipo: 'ERRO',
        mensagem: [msg],
      });
      setUnidades([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampi();
    fetchUnidades();
  }, []);


  const handleCreate = async (unidade) => {
    try {
      const response = await unidadeOrganizacionalService.cadastrar(unidade);
      setStatusMessage(response)
      handleCancel();
      setStatusMessage(response)
      setEditing(null)
      fetchUnidades();
    } catch (error) {
      const msg = 'Erro no servidor.' + error;
      setStatusMessage({
        tipo: 'ERRO',
        mensagem: [msg],
      });
    } 
  };

  const handleUpdate = async (unidade) => {
    try {
      const response = await unidadeOrganizacionalService.alterar(unidade.codCampus, unidade.codUnidade, unidade);
      setStatusMessage(response)
      setEditing(null);
      fetchUnidades();
    } catch (error) {
     setStatusMessage({ tipo: 'ERRO',  mensagem: [msg] });
    }
  };

  const handleDelete = async (unidade) => {
    try {
      const response = await unidadeOrganizacionalService.excluir(unidade.codCampus, unidade.codUnidade);
      setStatusMessage(response);
      fetchUnidades();
    } catch (error) {
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    }
  };


  const handleEdit = (unidade) => {
    setEditing(unidade);
    setFormData(unidade);
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
            <TitleBottom>{editing ? 'Editar Unidade Organizacional' : 'Cadastrar Unidade Organizacional'}</TitleBottom>
            <UnidadeOrganizacionalForm
                key={formKey}
                onSubmit={editing ? handleUpdate : handleCreate}
                onChange={handleChange}
                isEditing={!!editing}
                onCancel={handleCancel}
                formData={formData}
                campi={campi}
                unidades={unidades}
            />

            {loading ? (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                  <CircularProgress />
                </div>
              ) : (
              <CrudTable
                  title="Lista de Unidades"
                  columns={[
                      { label: CAMPOS.CODCAMPUS, field: 'codCampus' },
                      { label: CAMPOS.CODUNIDADE, field: 'codUnidade' },
                      { label: CAMPOS.SGLUNIDADE, field: 'sglUnidade' },
                      { label: CAMPOS.NOMUNIDADE, field: 'nomUnidade' }
                  ]}
                  data={unidades}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  getRowKey={item => `${item.codUnidade}-${item.codCampus}`}
                  statusMessage={statusMessage}
                  onCloseMessage={handleCloseMessage}
              />
            )}
        </Container>
    );
};
export default UnidadeOrganizacionalPage;
