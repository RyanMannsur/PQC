
import { TEXTOS, CAMPOS } from './constants';

const LocalEstocagemPage = () => {
  const [locais, setLocais] = useState([]);
  const [editing, setEditing] = useState(null);
  const containerRef = useRef(null);
  const anchorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    fetchLocais();
  }, []);

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

  const handleEdit = (local) => {
    setEditing(local);
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container ref={containerRef}>
      <div ref={anchorRef} />
      <TitleBottom>{editing ? TEXTOS.EDITAR_LOCAL : TEXTOS.CADASTRAR_LOCAL}</TitleBottom>
      <LocalEstocagemForm
        onSubmit={editing ? handleUpdate : handleCreate}
        initialData={editing}
        isEditing={!!editing}
        isADM={true}
        onDelete={editing ? () => handleDelete(editing) : undefined}
        onCancel={() => setEditing(null)}
      />
      <h2 style={{ marginTop: 40 }}>Lista de Locais</h2>
      <Table>
        <thead>
          <Tr>
            <Th>{CAMPOS.CODCAMPUS}</Th>
            <Th>{CAMPOS.CODUNIDADE}</Th>
            <Th>{CAMPOS.CODPREDIO}</Th>
            <Th>{CAMPOS.CODLAB}</Th>
            <Th>{CAMPOS.NOMLOCAL}</Th>
            <Th>{CAMPOS.ACOES}</Th>
          </Tr>
        </thead>
        <tbody>
          {locais.map(local => (
            <Tr key={local.codlaboratorio}>
              <Td>{local.codcampus}</Td>
              <Td>{local.codunidade}</Td>
              <Td>{local.codpredio}</Td>
              <Td>{local.codlaboratorio}</Td>
              <Td>{local.nomlocal}</Td>
              <Td>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEdit(local)}
                >{TEXTOS.EDITAR_LOCAL}</Button>
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
    </Container>
  );
};

export default LocalEstocagemPage;
