import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import UnidadeForm from '../../features/unidadeorganizacional';
import { Container, Table, Td, Th, Tr, TitleBottom, ModalOverlay, ModalContent, TooltipError } from './styles';
import unidadeService from '../../services/unidadeorganizacional/service';

const TEXTOS = {
  UNIDADE_CADASTRADA_SUCESSO: 'Unidade cadastrada com sucesso!',
  ERRO_CADASTRAR_UNIDADE: 'Erro ao cadastrar unidade.',
  UNIDADE_ATUALIZADA_SUCESSO: 'Unidade atualizada com sucesso!',
  ERRO_ATUALIZAR_UNIDADE: 'Erro ao atualizar unidade.',
  CONFIRMA_EXCLUSAO: 'Tem certeza que deseja excluir esta unidade?',
  SUCESSO: 'Sucesso',
  OK: 'OK',
  ERRO: 'Erro',
  EDITAR_UNIDADE: 'Editar Unidade',
  CADASTRAR_UNIDADE: 'Cadastrar Unidade',
  EXCLUIR: 'Excluir',
};

const CAMPOS = {
  CODCAMPUS: 'Campus',
  CODUNIDADE: 'Código Unidade',
  SGLUNIDADE: 'Sigla Unidade',
  NOMUNIDADE: 'Nome Unidade',
  ACOES: 'Ações',
};

const UnidadePage = () => {
  const [unidades, setUnidades] = useState([]);
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, message: "" });

  useEffect(() => {
    fetchUnidades();
  }, []);

  const fetchUnidades = async () => {
    const res = await unidadeService.listar();
    setUnidades(res.sort((a, b) => a.nomunidade.localeCompare(b.nomunidade)));
  };

  const handleCreate = async (unidade) => {
    try {
      await unidadeService.cadastrar(unidade);
      setModalMessage(TEXTOS.UNIDADE_CADASTRADA_SUCESSO);
      setIsModalOpen(true);
      window.location.reload();
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_CADASTRAR_UNIDADE;
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };

  const handleUpdate = async (unidade) => {
    try {
      await unidadeService.atualizar(unidade);
      setTooltip({ visible: true, message: TEXTOS.UNIDADE_ATUALIZADA_SUCESSO });
      setEditing(null);
      window.location.reload();
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_ATUALIZAR_UNIDADE;
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };

  const handleDelete = async (codunidade) => {
    await unidadeService.excluir(codunidade);
    window.location.reload();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const handleEdit = (unidade) => {
    setEditing(unidade);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{editing ? TEXTOS.EDITAR_UNIDADE : TEXTOS.CADASTRAR_UNIDADE}</TitleBottom>
      <UnidadeForm
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
        isEditing={!!editing}
        isADM={true}
        onDelete={editing ? () => handleDelete(editing.codunidade) : undefined}
      />
      <h2 style={{ marginTop: 40 }}>Lista de Unidades</h2>
      <Table>
        <thead>
          <Tr>
            <Th>{CAMPOS.CODCAMPUS}</Th>
            <Th>{CAMPOS.CODUNIDADE}</Th>
            <Th>{CAMPOS.SGLUNIDADE}</Th>
            <Th>{CAMPOS.NOMUNIDADE}</Th>
            <Th>{CAMPOS.ACOES}</Th>
          </Tr>
        </thead>
        <tbody>
          {unidades.map(unidade => (
            <Tr key={unidade.codunidade}>
              <Td>{unidade.codcampus}</Td>
              <Td>{unidade.codunidade}</Td>
              <Td>{unidade.sglunidade}</Td>
              <Td>{unidade.nomunidade}</Td>
              <Td>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(unidade)}
                >{TEXTOS.EDITAR_UNIDADE}</Button>
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

export default UnidadePage;
