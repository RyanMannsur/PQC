import React, { useState, useEffect, useRef } from 'react';
import LocalEstocagemForm from '../../features/localestocagem';
import { Button } from '../../components';
import CrudTable from '../../components/CrudTable';
import { getLocais, createLocal, updateLocal, deleteLocal } from '../../services/localService';
import { TEXTOS, CAMPOS } from './constants';
import { Container, TitleBottom, ModalOverlay, ModalContent, FormStyle } from './styles';

const LocalEstocagemPage = () => {
  const [locais, setLocais] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchLocais();
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

  const fetchLocais = async () => {
    const data = await getLocais();
    const arr = Array.isArray(data) ? data : [];
    setLocais(arr.length ? arr.sort((a, b) => String(a.nomlocal).localeCompare(String(b.nomlocal))) : []);
  };

  const handleCreate = async (local) => {
    try {
      await createLocal(local);
      setModalMessage(TEXTOS.LOCAL_CADASTRADO_SUCESSO);
      setIsModalOpen(true);
      window.location.reload();
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_CADASTRAR_LOCAL;
      setModalMessage(msg);
      setIsModalOpen(true);
    }
  };

  const handleUpdate = async (local) => {
    try {
      await updateLocal(local);
      setModalMessage(TEXTOS.LOCAL_ATUALIZADO_SUCESSO);
      setIsModalOpen(true);
      setEditing(null);
      window.location.reload();
    } catch (error) {
      const msg = error?.response?.data?.error || error.message || TEXTOS.ERRO_ATUALIZAR_LOCAL;
      setModalMessage(msg);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (local) => {
    await deleteLocal(local);
    window.location.reload();
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.reload();
  };

  const [formKey, setFormKey] = useState(0);

  const handleEdit = (local) => {
    setEditing(local);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormKey(prev => prev + 1); 
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      minHeight: "100vh", // ocupa toda a altura da viewport
      width: "100%",
      boxSizing: "border-box"
    }}>
      <Container ref={containerRef}>
        <div ref={anchorRef} />
          
          <FormStyle style={{width: "400px"}}>
            <TitleBottom>{editing ? TEXTOS.EDITAR_LOCAL : TEXTOS.CADASTRAR_LOCAL}</TitleBottom>
            <LocalEstocagemForm
            key={formKey}
            onSubmit={editing ? handleUpdate : handleCreate}
            initialData={editing}
            isEditing={!!editing}
            isADM={usuario?.isADM}
            onDelete={editing && usuario?.isADM ? () => handleDelete(editing) : undefined}
            onCancel={handleCancel}
            />
          </FormStyle>
      
        <CrudTable
          title="Lista de Locais"
          columns={[
            { label: CAMPOS.CODCAMPUS, field: 'codcampus' },
            { label: CAMPOS.CODUNIDADE, field: 'codunidade' },
            { label: CAMPOS.CODPREDIO, field: 'codpredio' },
            { label: CAMPOS.CODLAB, field: 'codlaboratorio' },
            { label: CAMPOS.NOMLOCAL, field: 'nomlocal' }
          ]}
          data={locais}
          onEdit={handleEdit}
          editText={TEXTOS.EDITAR_LOCAL}
          getRowKey={item => item.codlaboratorio}
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
      </Container>
    </div>
  );
};

export default LocalEstocagemPage;
