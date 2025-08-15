import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listarLocaisUsuarioToken, listarLocaisDisponiveis, adicionarLocalUsuario, removerLocalUsuario } from '../../../services/auth/service';
import { Button, CrudTable, FormGenerator } from '../../../components';
import { Wrapper, Message, TopBar } from './styles';

const GerenciarLocaisUsuario = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [locais, setLocais] = useState([]);
  const [locaisDisponiveis, setLocaisDisponiveis] = useState([]);
  const [formData, setFormData] = useState({ local: '' });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    fetchLocais();
    fetchLocaisDisponiveis();
  }, [token]);

  const fetchLocais = async () => {
    try {
      const res = await listarLocaisUsuarioToken(token);
      setLocais(res);
    } catch (e) {
      setErro('Erro ao buscar locais do usuário');
    }
  };

  const fetchLocaisDisponiveis = async () => {
    try {
      const res = await listarLocaisDisponiveis(token);
      setLocaisDisponiveis(res);
    } catch (e) {
      setErro('Erro ao buscar locais disponíveis');
    }
  };

  const handleAdicionar = async (e) => {
    e.preventDefault();
    if (!formData.local) return;
    try {
      await adicionarLocalUsuario(token, formData.local);
      setMensagem('Local adicionado com sucesso!');
      setFormData({ local: '' });
      fetchLocais();
      fetchLocaisDisponiveis();
    } catch (e) {
      setErro('Erro ao adicionar local');
    }
  };

  const handleRemover = async (local) => {
    try {
      await removerLocalUsuario(token, local);
      setMensagem('Local removido com sucesso!');
      fetchLocais();
      fetchLocaisDisponiveis();
    } catch (e) {
      setErro('Erro ao remover local');
    }
  };

  return (
    <Wrapper>
      <h2 style={{ marginBottom: 16 }}>Gerenciar Locais do Usuário</h2>
      {mensagem && <Message success>{mensagem}</Message>}
      {erro && <Message>{erro}</Message>}
      <TopBar>
        <FormGenerator
          fields={[{
            name: 'local',
            label: 'Adicionar Local',
            type: 'select',
            required: true,
            options: locaisDisponiveis.map(local => ({ value: local.chave, label: local.nomLocal || local.nomlocal })),
            placeholder: 'Selecione um local',
          }]}
          formData={formData}
          onChange={e => setFormData(f => ({ ...f, [e.target.name]: e.target.value }))}
          onSubmit={handleAdicionar}
          isEditing={false}
          isADM={true}
          onCancel={() => navigate(-1)}
          editCancelText="Voltar"
        />
      </TopBar>
      <CrudTable
        title="Locais Gerenciados"
        columns={[
          { label: 'Campus', field: 'codCampus' },
          { label: 'Unidade', field: 'codUnidade' },
          { label: 'Prédio', field: 'codPredio' },
          { label: 'Laboratório', field: 'codLaboratorio' },
          { label: 'Nome', field: 'nomLocal' },
        ]}
        data={locais}
        getRowKey={item => item.chave}
        renderActions={local => (
          <Button $variant="danger" size="small" onClick={() => handleRemover(local)}>
            Remover
          </Button>
        )}
      />
    </Wrapper>
  );
};

export default GerenciarLocaisUsuario;
