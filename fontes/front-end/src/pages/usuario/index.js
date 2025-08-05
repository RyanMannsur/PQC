
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Button } from '../../components';
import { listarUsuarios, transformarUsuarioAdm } from '../../services/auth/service';
import { TEXTOS } from './constantes';
import { Container, TitleBottom, ModalOverlay, ModalContent, TooltipError } from './styles';
import CrudTable from '../../components/CrudTable';


const UsuarioPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioAtual, setUsuarioAtual] = useState({});
  // Removido: edição local de usuário não é mais usada
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, message: "" });
  const formKey = useRef(0);
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
      setEditing(null);
      fetchUsuarios();
      setModalMessage(TEXTOS.USUARIO_ATUALIZADO_SUCESSO);
      setIsModalOpen(true);
    } catch (error) {
      setTooltip({ visible: true, message: TEXTOS.ERRO_ATUALIZAR_USUARIO });
      setTimeout(() => setTooltip({ visible: false, message: '' }), 4000);
    }
  };

  const handleEdit = (usuario) => {
    // Redireciona sempre para a página de gerenciamento de locais
    if (usuario.token) {
      navigate(`/usuarios/${usuario.token}/locais`);
    } else {
      setTooltip({ visible: true, message: 'Usuário sem token cadastrado.' });
      setTimeout(() => setTooltip({ visible: false, message: '' }), 4000);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchUsuarios();
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{TEXTOS.CADASTRAR_USUARIO}</TitleBottom>
      {/* Formulário removido: cadastro de novo usuário */}
      <CrudTable
        title="Lista de Usuários"
        columns={[
          { label: 'CPF', field: 'cpf' },
          {
            label: 'Administrador',
            field: 'isADM',
            render: (item) => {
              if (item.isADM) return TEXTOS.SIM;
              if (usuarioAtual?.isADM) {
                return (
                  <Button
                    $variant="primary"
                    size="small"
                    onClick={() => handleTransformarAdm(item)}
                  >{TEXTOS.TRANSFORMAR_ADM}</Button>
                );
              }
              return TEXTOS.NAO;
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
      {tooltip.visible && (
        <TooltipError>
          <strong>{TEXTOS.ERRO}</strong> {tooltip.message}
        </TooltipError>
      )}
    </Container>
  );
};

export default UsuarioPage;
