import { Container, TitleBottom } from '../usuario/styles';

const ManualPage = () => {
  return (
    <Container>
      <TitleBottom>Manual do Sistema</TitleBottom>
      <div style={{ margin: '48px 0', fontSize: 19, lineHeight: 1.7, maxWidth: 700 }}>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>Acesso ao Sistema</h2>
          <p><b>O login é o mesmo do SIGAA.</b></p>
          <p>Ao entrar, você será redirecionado ao seu laboratório. Caso gerencie mais de um, será solicitado que escolha qual deseja acessar.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>Implantação e Produtos</h2>
          <p>Se o laboratório ainda não foi implantado, realize a implantação assim que acessar. No futuro, só será possível adicionar produtos (compra ou doação) já implantados no sistema.</p>
          <p>Para adicionar produtos, acesse <b>Adicionar Produtos</b>, escolha se foi compra ou doação e inclua-os na listagem de produtos implantados.</p>
          <p>Para transferir produtos, vá em <b>Transferências</b>, pesquise, selecione o produto desejado e, na tela seguinte, escolha o destino da transferência.</p>
          <p>Você pode implantar novos produtos no laboratório a qualquer momento, acessando a tela de <b>Implantação</b>.</p>
        </section>
                <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>Inventário</h2>
          <p>Na tela <b>Inventário</b> é possível visualizar a quantidade de cada produto no laboratório. Você pode atualizar a quantidade dos produtos nessa tela sempre que necessário.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>Solicitações e Edição</h2>
          <p>É possível solicitar a adição de novos produtos, campus, unidades e locais, além de editar esses registros conforme necessário.</p>
        </section>
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>Permissões de Administrador</h2>
          <ul style={{ marginLeft: 24, marginBottom: 16 }}>
            <li>Ativar e excluir produtos, campus, locais e unidades.</li>
            <li>Transformar outros usuários em administradores.</li>
            <li>Gerenciar quais laboratórios cada usuário pode acessar.</li>
          </ul>
        </section>
        <section>
          <h2 style={{ fontSize: 22, marginBottom: 16 }}>Dúvidas</h2>
          <p>Em caso de dúvidas, consulte o administrador do sistema.</p>
        </section>
      </div>
    </Container>
  );
};

export default ManualPage;
