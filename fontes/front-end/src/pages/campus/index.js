// ...existing code...
import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import CampusForm from '../../features/campus';
import { Container, Table, Td, Th, Tr, TitleBottom, ModalOverlay, ModalContent, TooltipError } from './styles';
import campusService from '../../services/campus/service';
import { TEXTOS, CAMPOS } from './constantes';

const CampusPage = () => {
  const [campi, setCampi] = useState([]);
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, message: "" });

  useEffect(() => {
    fetchCampi();
  }, []);

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

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{editing ? TEXTOS.EDITAR_CAMPUS : TEXTOS.CADASTRAR_CAMPUS}</TitleBottom>
      <CampusForm
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
        isEditing={!!editing}
        isADM={true}
        onDelete={editing ? () => handleDelete(editing.codcampus) : undefined}
      />
      <h2 style={{ marginTop: 40 }}>Lista de Campi</h2>
      <Table>
        <thead>
          <Tr>
            <Th>{CAMPOS.CODCAMPUS}</Th>
            <Th>{CAMPOS.NOMCAMPUS}</Th>
            <Th>{CAMPOS.ACOES}</Th>
          </Tr>
        </thead>
        <tbody>
          {campi.map(campus => (
            <Tr key={campus.codcampus}>
              <Td>{campus.codcampus}</Td>
              <Td>{campus.nomcampus}</Td>
              <Td>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(campus)}
                >{TEXTOS.EDITAR_CAMPUS}</Button>
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

export default CampusPage;
