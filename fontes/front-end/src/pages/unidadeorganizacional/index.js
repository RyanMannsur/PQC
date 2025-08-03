import React, { useState, useEffect, useRef } from 'react';
import UnidadeForm from '../../features/unidadeorganizacional';
import unidadeService from '../../services/unidadeorganizacional/service';
import { Button } from '../../components';
import { TEXTOS, CAMPOS } from './constants';
import { Container, Table, Td, Th, Tr, TitleBottom, ModalOverlay, ModalContent, TooltipError } from './styles';

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
      <h2 style={{ marginTop: 40 }}>Lista de Unidades</h2>
      <Table>
        <thead>
          <Tr>
            <Th>{CAMPOS.CODUNIDADE}</Th>
            <Th>{CAMPOS.CODCAMPUS}</Th>
            <Th>{CAMPOS.SGLUNIDADE}</Th>
            <Th>{CAMPOS.NOMUNIDADE}</Th>
            <Th>{CAMPOS.ACOES}</Th>
          </Tr>
        </thead>
        <tbody>
          {unidades.map(unidade => (
            <Tr key={unidade.codunidade + '-' + unidade.codcampus}>
              <Td>{unidade.codunidade}</Td>
              <Td>{unidade.codcampus}</Td>
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
