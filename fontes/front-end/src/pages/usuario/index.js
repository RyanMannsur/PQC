
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import { listarUsuarios, transformarUsuarioAdm, removerUsuarioAdm } from '../../services/auth/service';
import { TEXTOS } from './constantes';
import { Container, TitleBottom, ModalOverlay, ModalContent, TooltipError } from './styles';
import CrudTable from '../../components/CrudTable';


const UsuarioPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, message: "" });
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
    const token = localStorage.getItem('userToken');
    if (token) {
      fetchUsuarioAtual(token);
    }
  }, []);

  const fetchUsuarioAtual = async (token) => {
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
      setUsuarioAtual(data);
    } catch (error) {
      setUsuarioAtual({});
    }
  };

  const fetchUsuarios = async () => {
    try {
      const res = await listarUsuarios();
      setUsuarios(res.sort((a, b) => a.cpf.localeCompare(b.cpf)));
    } catch (error) {
      setTooltip({ visible: true, message: 'Erro ao listar usuários' });
      setTimeout(() => setTooltip({ visible: false, message: '' }), 4000);
    }
  };

  const handleTransformarAdm = async (usuario) => {
    try {
      await transformarUsuarioAdm(usuario.id);
      setTooltip({ visible: false, message: '' });
      setModalMessage(TEXTOS.USUARIO_ATUALIZADO_SUCESSO);
      setIsModalOpen(true);
      setEditing && setEditing(null);
      await fetchUsuarios();
    } catch (error) {
      setTooltip({ visible: true, message: TEXTOS.ERRO_ATUALIZAR_USUARIO });
      setTimeout(() => setTooltip({ visible: false, message: '' }), 4000);
    }
  };

  const handleRemoverAdm = async (usuario) => {
    try {
      await removerUsuarioAdm(usuario.id);
      setTooltip({ visible: false, message: '' });
      setModalMessage('Status de administrador removido com sucesso!');
      setIsModalOpen(true);
      setEditing && setEditing(null);
      await fetchUsuarios();
    } catch (error) {
      setTooltip({ visible: true, message: 'Erro ao remover status de admin do usuário' });
      setTimeout(() => setTooltip({ visible: false, message: '' }), 4000);
    }
  };

  const handleEdit = (usuario) => {
    if (usuario.token) {
      navigate(`/usuarios/${usuario.token}/locais`);
    } else {
      setTooltip({ visible: true, message: 'Usuário sem token cadastrado.' });
      setTimeout(() => setTooltip({ visible: false, message: '' }), 4000);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTooltip({ visible: false, message: '' });
    fetchUsuarios();
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{TEXTOS.CADASTRAR_USUARIO}</TitleBottom>
      <CrudTable
        title="Lista de Usuários"
        columns={[
          { label: 'CPF', field: 'cpf' },
          {
            label: 'Administrador',
            field: 'isADM',
            render: (item) => {
              if (usuarioAtual?.isADM) {
                if (item.isADM) {
                  return (
                    <Button
                      $variant="danger"
                      size="small"
                      onClick={() => handleRemoverAdm(item)}
                    >Remover de Administrador</Button>
                  );
                } else {
                  return (
                    <Button
                      $variant="primary"
                      size="small"
                      onClick={() => handleTransformarAdm(item)}
                    >{TEXTOS.TRANSFORMAR_ADM}</Button>
                  );
                }
              }
              return item.isADM ? TEXTOS.SIM : TEXTOS.NAO;
            }
          }
        ]}
        data={usuarios}
        getRowKey={item => item.cpf}
        {...(usuarioAtual?.isADM ? { onEdit: handleEdit, editText: TEXTOS.EDITAR } : {})}
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
      {tooltip.visible && !isModalOpen && (
        <TooltipError>
          <strong>{TEXTOS.ERRO}</strong> {tooltip.message}
        </TooltipError>
      )}
    </Container>
  );
};

export default UsuarioPage;
