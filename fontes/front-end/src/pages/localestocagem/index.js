import { useState, useEffect, useRef } from 'react';
import LocalEstocagemForm from '../../features/localestocagem';
import CrudTable from '../../components/CrudTable';
import localEstocagemService from '../../services/localEstocagemService';
import campusService from '../../services/campusService';
import unidadeOrganizacionalService from '../../services/unidadeOrganizacionalService';
import usuarioService from '../../services/usuarioService'
import { CircularProgress } from "@mui/material";

import { CAMPOS } from '../constants';
import { Container, TitleBottom } from './styles';

const LocalEstocagemPage = () => {
  const [locais, setLocais] = useState([]);
  const [campi, setCampi] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [formKey, setFormKey] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    codCampus: '',
    codUnidade: '',
    codPredio: '',
    codLaboratorio: '',
    nomLocal: '',
    codCPFResponsavel: ''
  });
  
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'codCampus') {
      setFormData(prevData => ({ 
        ...prevData, 
        codCampus: value, 
        codUnidade: '' // Limpa o campo de unidade
      }));
      if (value) {
        fetchUnidades(value); // Busca unidades para o novo campus
      } else {
        setUnidades([]);
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  
  // --- Lógica de busca de dados ---

  const fetchLocais = async () => {
    try {
      setLoading(true);
      const response = await localEstocagemService.listar();
      if (Array.isArray(response)) {
        setLocais(response);
      } else {
        setStatusMessage(response);
      }
    } catch (error) {
      const msg = 'Erro no servidor: ' + error.message;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
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
      const msg = 'Erro no servidor: ' + error.message;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

  const fetchUnidades = async (codCampus) => {
    try {
      setLoading(true);
      const response = await unidadeOrganizacionalService.obterUnidadePorCampus(codCampus);
      if (Array.isArray(response)) {
        setUnidades(response);
      } else {
        setStatusMessage(response);
      }
    } catch (error) {
      const msg = 'Erro no servidor: ' + error.message;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

  const fetchResponsaveis = async () => {
    try {
      setLoading(true);
      const response = await usuarioService.obterResponsaveis();
      if (Array.isArray(response)) {
        setResponsaveis(response);
      } else {
        setStatusMessage(response);
      }
    } catch (error) {
      const msg = 'Erro no servidor: ' + error.message;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocais();
    fetchCampi();
    fetchResponsaveis();
  }, []);

 
  // --- Lógica de CRUD e UI ---

  const handleCreate = async (local) => {
    try {
      const response = await localEstocagemService.cadastrar(local);
      setStatusMessage(response);
      handleCancel();
      fetchLocais();
    } catch (error) {
      const msg = 'Erro no servidor: ' + error.message;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    }
  };

  const handleUpdate = async (local) => {
    try {
      const response = await localEstocagemService.alterar(local);
      setStatusMessage(response);
      handleCancel();
      fetchLocais();
    } catch (error) {
      const msg = 'Erro no servidor: ' + error.message;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    }
  };

  const handleDelete = async (local) => {
    try {
      const response = await localEstocagemService.excluir(local);
      setStatusMessage(response);
      fetchLocais();
    } catch (error) {
      const msg = 'Erro no servidor: ' + error.message;
      setStatusMessage({ tipo: 'ERRO', mensagem: [msg] });
    }
  };

  const handleEdit = (local) => {
    setEditing(local);
    setFormData(local)
    if (local.codCampus) {
      fetchUnidades(local.codCampus);
    }
    setFormKey(prev => prev + 1);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
      <TitleBottom>{editing ? 'Editar Local de Estocagem' : 'Cadastrar Local de Estocagem'}</TitleBottom>
      <LocalEstocagemForm
        key={formKey}
        onSubmit={editing ? handleUpdate : handleCreate}
        isEditing={!!editing}
        onCancel={handleCancel}
        campi={campi}
        unidades={unidades}
        responsaveis={responsaveis}
        formData={formData}
        onChange={handleChange}
      />

      {loading ? (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
      <CrudTable
        title="Lista de Locais"
        columns={[
          { label: CAMPOS.CODCAMPUS, field: 'codCampus' },
          { label: CAMPOS.CODUNIDADE, field: 'codUnidade' },
          { label: CAMPOS.CODPREDIO, field: 'codPredio' },
          { label: CAMPOS.CODLABORATORIO, field: 'codLaboratorio' },
          { label: CAMPOS.NOMLOCAL, field: 'nomLocal' },
          { label: CAMPOS.CODCPFRESPONSAVEL, field: 'codCPFResponsavel' }
        ]}
        data={locais}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getRowKey={item => `${item.codCampus}-${item.codUnidade}-${item.codPredio}-${item.codLaboratorio}`}
        statusMessage={statusMessage}
        onCloseMessage={handleCloseMessage}
      />
      )}
    </Container>
  );
};

export default LocalEstocagemPage;