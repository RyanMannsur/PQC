import React, { useState } from "react";
import { Button, Input, Select, Checkbox, FormGroup } from "../../components";
import styled from "styled-components";

const TestContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const ComponentsTest = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    isActive: false,
    loading: false
  });

  const categoryOptions = [
    { value: "categoria1", label: "Categoria 1" },
    { value: "categoria2", label: "Categoria 2" },
    { value: "categoria3", label: "Categoria 3" }
  ];

  const handleSubmit = () => {
    setFormData({ ...formData, loading: true });
    setTimeout(() => {
      setFormData({ ...formData, loading: false });
      alert("Formulário enviado com sucesso!");
    }, 2000);
  };

  return (
    <TestContainer>
      <h1>Teste dos Componentes Padronizados</h1>

      <Section>
        <Title>Botões</Title>
        <FormGroup direction="row" $gap="medium">
          <Button $variant="primary">Primário</Button>
          <Button $variant="secondary">Secundário</Button>
          <Button $variant="success">Sucesso</Button>
          <Button $variant="danger">Perigo</Button>
          <Button $variant="warning">Aviso</Button>
          <Button $variant="outline">Outline</Button>
        </FormGroup>
        
        <FormGroup direction="row" $gap="medium" style={{ marginTop: "16px" }}>
          <Button size="small">Pequeno</Button>
          <Button size="medium">Médio</Button>
          <Button size="large">Grande</Button>
        </FormGroup>
        
        <FormGroup direction="row" $gap="medium" style={{ marginTop: "16px" }}>
          <Button disabled>Desabilitado</Button>
          <Button loading={formData.loading} onClick={handleSubmit}>
            {formData.loading ? "Carregando..." : "Com Loading"}
          </Button>
        </FormGroup>
      </Section>

      <Section>
        <Title>Inputs</Title>
        <FormGroup direction="column" $gap="medium">
          <Input
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite seu nome"
            required
          />
          
          <Input
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Digite seu e-mail"
            $error={formData.email && !formData.email.includes("@")}
            errorMessage="E-mail inválido"
          />
          
          <FormGroup direction="row" $gap="medium">
            <Input
              label="Input Pequeno"
              size="small"
              value="Pequeno"
              onChange={() => {}}
            />
            <Input
              label="Input Médio"
              size="medium"
              value="Médio"
              onChange={() => {}}
            />
            <Input
              label="Input Grande"
              size="large"
              value="Grande"
              onChange={() => {}}
            />
          </FormGroup>
          
          <Input
            label="Campo Desabilitado"
            value="Não editável"
            disabled
            onChange={() => {}}
          />
        </FormGroup>
      </Section>

      <Section>
        <Title>Select</Title>
        <FormGroup direction="column" $gap="medium">
          <Select
            label="Categoria"
            options={categoryOptions}
            value={formData.category}
            onChange={(option) => setFormData({ ...formData, category: option?.value })}
            placeholder="Escolha uma categoria"
            required
          />
          
          <Select
            label="Select com Erro"
            options={categoryOptions}
            value=""
            onChange={() => {}}
            $error={true}
            placeholder="Este select tem erro"
          />
          
          <Select
            label="Select Desabilitado"
            options={categoryOptions}
            value="categoria1"
            onChange={() => {}}
            disabled
          />
        </FormGroup>
      </Section>

      <Section>
        <Title>Checkbox</Title>
        <FormGroup direction="column" $gap="medium">
          <Checkbox
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            label="Produto ativo"
          />
          
          <Checkbox
            checked={true}
            onChange={() => {}}
            label="Checkbox obrigatório"
            required
          />
          
          <Checkbox
            checked={false}
            onChange={() => {}}
            label="Checkbox com erro"
            $error={true}
          />
          
          <Checkbox
            checked={true}
            onChange={() => {}}
            label="Checkbox desabilitado"
            disabled
          />
        </FormGroup>
      </Section>

      <Section>
        <Title>FormGroup Layouts</Title>
        <FormGroup direction="column" $gap="large">
          <div>
            <h3>Layout em linha (Row)</h3>
            <FormGroup direction="row" $gap="medium">
              <Input label="Campo 1" value="Valor 1" onChange={() => {}} />
              <Input label="Campo 2" value="Valor 2" onChange={() => {}} />
              <Button>Ação</Button>
            </FormGroup>
          </div>
          
          <div>
            <h3>Layout em coluna (Column)</h3>
            <FormGroup direction="column" $gap="small">
              <Input label="Campo A" value="Valor A" onChange={() => {}} />
              <Input label="Campo B" value="Valor B" onChange={() => {}} />
              <Button>Enviar</Button>
            </FormGroup>
          </div>
        </FormGroup>
      </Section>

      <Section>
        <Title>Exemplo de Formulário Completo</Title>
        <FormGroup direction="column" $gap="medium">
          <Input
            label="Nome do Produto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Digite o nome do produto"
            required
          />
          
          <FormGroup direction="row" $gap="medium">
            <Input
              label="Pureza (%)"
              type="number"
              value=""
              onChange={() => {}}
              placeholder="0-100"
            />
            <Input
              label="Densidade"
              type="number"
              value=""
              onChange={() => {}}
              placeholder="g/cm³"
            />
          </FormGroup>
          
          <Select
            label="Lista de Controle"
            options={[
              { value: "lista1", label: "Lista I" },
              { value: "lista2", label: "Lista II" },
              { value: "lista3", label: "Lista III" }
            ]}
            value=""
            onChange={() => {}}
            placeholder="Selecione a lista"
            required
          />
          
          <Checkbox
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            label="Produto ativo no sistema"
          />
          
          <FormGroup direction="row" $gap="medium">
            <Button 
              $variant="outline" 
              onClick={() => setFormData({ name: "", email: "", category: "", isActive: false })}
            >
              Limpar
            </Button>
            <Button onClick={handleSubmit} loading={formData.loading}>
              {formData.loading ? "Salvando..." : "Salvar Produto"}
            </Button>
          </FormGroup>
        </FormGroup>
      </Section>
    </TestContainer>
  );
};

export default ComponentsTest;
