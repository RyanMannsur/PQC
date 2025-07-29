import { useState, useEffect } from 'react';
import { Button, Input } from '../../components';
import { Form, Row } from './styles';

const ProdutoForm = ({ onSubmit, initialData = {}, isEditing, isADM = true, onCancel, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    nomProduto: '',
    nomLista: '',
    perPureza: '',
    vlrDensidade: '',
    idtAtivo: false,
    ncm: ''
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
    const { nomProduto, nomLista, perPureza, vlrDensidade, idtAtivo, ncm } = formData;
    onSubmit({ nomProduto, nomLista, perPureza, vlrDensidade, idtAtivo: false, ncm });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <form className={Form.styledComponentId ? Form.styledComponentId : ''} onSubmit={handleSubmit}>
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
      <div style={{ maxWidth: 350, minWidth: 220, marginTop: 8, display: 'flex', gap: 8 }}>
        <Button variant="primary" type="submit" style={{ width: isADM ? '50%' : '100%' }}>{isEditing ? 'Atualizar' : 'Cadastrar'}</Button>
        {isEditing && (
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              console.log('Botão Cancelar clicado');
              if (typeof onCancel === 'function') onCancel();
            }}
            style={{ width: isADM ? '25%' : '50%' }}
          >Cancelar</Button>
        )}
        {isADM && isEditing ? (
          <Button variant="danger" type="button" onClick={handleDelete} style={{ width: '25%' }}>Excluir</Button>
        ) : null}
      </div>
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 300, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir este produto?</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <Button variant="danger" type="button" onClick={() => { setShowDeleteModal(false); if (typeof onDelete === 'function') { onDelete(); window.location.reload(); } }}>Excluir</Button>
              <Button variant="secondary" type="button" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
export default ProdutoForm;
