import React, { useState, useEffect, useRef } from 'react';
import UnidadeForm from '../../features/unidadeorganizacional';
import unidadeService from '../../services/unidadeorganizacional/service';
import { Button } from '../../components';
import CrudTable from '../../components/CrudTable';
import { TEXTOS, CAMPOS } from './constants';
import { Container, TitleBottom, ModalOverlay, ModalContent, TooltipError,} from './styles';
import { FormStyle } from '../../styles/global';
const UnidadePage = () => {
  const [formKey, setFormKey] = useState(0);
  const [unidades, setUnidades] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, message: "" });
 
  useEffect(() => {
    fetchUnidades();
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
      await unidadeService.atualizar(unidade.codcampus, unidade.codunidade, unidade);
      setTooltip({ visible: true, message: TEXTOS.UNIDADE_ATUALIZADA_SUCESSO });
      setEditing(null);
      window.location.reload();
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_ATUALIZAR_UNIDADE;
      setTooltip({ visible: true, message: msg });
      setTimeout(() => setTooltip({ visible: false, message: "" }), 4000);
    }
  };

  const handleDelete = async (codcampus, codunidade) => {
    await unidadeService.excluir(codcampus, codunidade);
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

  const handleCancel = () => {
    setEditing(null);
    setFormKey(prev => prev + 1);
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      
      <FormStyle>
        <TitleBottom>{editing ? TEXTOS.EDITAR_UNIDADE : TEXTOS.CADASTRAR_UNIDADE}</TitleBottom>
        <UnidadeForm
          key={formKey}
          onSubmit={editing ? handleUpdate : handleCreate}
          initialData={editing}
          isEditing={!!editing}
          isADM={usuario?.isADM}
          onDelete={editing && usuario?.isADM ? () => handleDelete(editing.codcampus, editing.codunidade) : undefined}
          onCancel={handleCancel}
        />
      </FormStyle>
      <CrudTable
        title="Lista de Unidades"
        columns={[
          { label: CAMPOS.CODUNIDADE, field: 'codunidade' },
          { label: CAMPOS.CODCAMPUS, field: 'codcampus' },
          { label: CAMPOS.SGLUNIDADE, field: 'sglunidade' },
          { label: CAMPOS.NOMUNIDADE, field: 'nomunidade' }
        ]}
        data={unidades}
        onEdit={handleEdit}
        editText={TEXTOS.EDITAR_UNIDADE}
        getRowKey={item => item.codunidade + '-' + item.codcampus}
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

export default UnidadePage;
