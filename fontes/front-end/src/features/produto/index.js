import { useState, useEffect } from 'react';
import { Button, Input, Checkbox } from '../../components';
import { Form, Row } from './styles';

const ProdutoForm = ({ onSubmit, initialData = {}, isEditing }) => {
  const [formData, setFormData] = useState({
    codProduto: '',
    nomProduto: '',
    nomLista: '',
    perPureza: '',
    vlrDensidade: '',
    idtAtivo: false,
    ncm: '',
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
    // Sempre criar com idtAtivo = false
    onSubmit({ ...formData, idtAtivo: false });
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
        <label>NCM:</label>
        <Input name="ncm" value={formData.ncm} onChange={handleChange} maxLength={8} placeholder="NCM (8 dígitos)" />
      </Row>
      <div style={{ maxWidth: 350, minWidth: 220, marginTop: 8 }}>
        <Button variant="primary" type="submit" style={{ width: '100%' }}>{isEditing ? 'Atualizar' : 'Cadastrar'}</Button>
      </div>
    </Form>
  );
};

export default ProdutoForm;
