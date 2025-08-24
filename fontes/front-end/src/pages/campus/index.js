import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import CrudTable from '../../components/CrudTable';
import CampusForm from '../../features/campus';
import { Container, TitleBottom, ModalOverlay, ModalContent, TooltipError} from './styles';
import campusService from '../../services/campus/service';
import { TEXTOS, CAMPOS } from './constantes';
import { FormStyle } from '../../styles/global';
const CampusPage = () => {
  const [formKey, setFormKey] = useState(0);
  const [campi, setCampi] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, message: "" });

  useEffect(() => {
    fetchCampi();
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

  const fetchCampi = async () => {
    const res = await campusService.listar();
    setCampi(res.sort((a, b) => a.nomcampus.localeCompare(b.nomcampus)));
  };

  const handleCreate = async (campus) => {
    try {
      await campusService.cadastrar(campus);
      setModalMessage(TEXTOS.CAMPUS_CADASTRADO_SUCESSO);
      setIsModalOpen(true);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_CADASTRAR_CAMPUS;
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };

  const handleUpdate = async (campus) => {
    try {
      await campusService.atualizar(campus);
      setEditing(null);
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_ATUALIZAR_CAMPUS;
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };

  const handleDelete = async (codCampus) => {
    await campusService.excluir(codCampus);
    window.location.reload();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleEdit = (campus) => {
    setEditing(campus);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormKey(prev => prev + 1);
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      
      <FormStyle>
        <TitleBottom>{editing ? TEXTOS.EDITAR_CAMPUS : TEXTOS.CADASTRAR_CAMPUS}</TitleBottom>
        <CampusForm
          key={formKey}
          onSubmit={editing ? handleUpdate : handleCreate}
          initialData={editing}
          isEditing={!!editing}
          isADM={usuario?.isADM}
          onDelete={editing && usuario?.isADM ? () => handleDelete(editing.codcampus) : undefined}
          onCancel={handleCancel}
        />
      </FormStyle>
      <CrudTable
        title="Lista de Campi"
        columns={[{ label: CAMPOS.CODCAMPUS, field: 'codcampus' }, { label: CAMPOS.NOMCAMPUS, field: 'nomcampus' }]}
        data={campi}
        onEdit={handleEdit}
        editText={TEXTOS.EDITAR_CAMPUS}
        getRowKey={item => item.codcampus}
      />
      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h3>{TEXTOS.SUCESSO}</h3>
            <p>{modalMessage}</p>
            <Button $variant="primary" onClick={handleModalClose}>{TEXTOS.OK}</Button>
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

export default CampusPage;
