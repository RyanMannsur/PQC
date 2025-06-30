import { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Row } from './styles';

const ProdutoForm = ({ onSubmit, initialData = {}, isEditing }) => {
  const [formData, setFormData] = useState({
    codProduto: '',
    nomProduto: '',
    nomLista: '',
    perPureza: '',
    vlrDensidade: '',
    idtAtivo: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <label>Código:</label>
        <Input name="codProduto" value={formData.codProduto} onChange={handleChange} disabled={isEditing} required />
      </Row>
      <Row>
        <label>Nome:</label>
        <Input name="nomProduto" value={formData.nomProduto} onChange={handleChange} required />
      </Row>
      <Row>
        <label>Lista:</label>
        <Input name="nomLista" value={formData.nomLista} onChange={handleChange} required />
      </Row>
      <Row>
        <label>Pureza:</label>
        <Input name="perPureza" type="number" value={formData.perPureza} onChange={handleChange} />
      </Row>
      <Row>
        <label>Densidade:</label>
        <Input name="vlrDensidade" type="number" value={formData.vlrDensidade} onChange={handleChange} />
      </Row>
      <Row>
        <label>Ativo:</label>
        <Checkbox name="idtAtivo" type="checkbox" checked={formData.idtAtivo} onChange={handleChange} />
      </Row>
      <Button type="submit">{isEditing ? 'Atualizar' : 'Cadastrar'}</Button>
    </Form>
  );
};

export default ProdutoForm;
