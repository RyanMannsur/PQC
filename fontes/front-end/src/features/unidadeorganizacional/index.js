import { useState, useEffect } from 'react';
import { Button, Input, InputSelect } from '../../components';
import { Form, Row } from '../../pages/unidadeorganizacional/styles';
import campusService from '../../services/campus/service';

const UnidadeForm = ({ onSubmit, initialData = {}, isEditing, isADM = true, onCancel, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    codcampus: '',
    codunidade: '',
    sglunidade: '',
    nomunidade: ''
  });
  const [campi, setCampi] = useState([]);

  useEffect(() => {
    campusService.listar().then(setCampi);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ ...formData });
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <form className={Form.styledComponentId ? Form.styledComponentId : ''} onSubmit={handleSubmit}>
      <Row>
        <label>Campus:</label>
        <InputSelect
          name="codcampus"
          value={formData.codcampus ? String(formData.codcampus) : ""}
          options={campi.map(c => ({ value: String(c.codcampus), label: `${c.codcampus} - ${c.nomcampus}` }))}
          onChange={value => setFormData({ ...formData, codcampus: value })}
          required
        />
      </Row>
      <Row>
        <label>Código Unidade:</label>
        <Input name="codunidade" value={formData.codunidade} onChange={handleChange} required maxLength={8} />
      </Row>
      <Row>
        <label>Sigla Unidade:</label>
        <Input name="sglunidade" value={formData.sglunidade} onChange={handleChange} required maxLength={10} />
      </Row>
      <Row>
        <label>Nome Unidade:</label>
        <Input name="nomunidade" value={formData.nomunidade} onChange={handleChange} required maxLength={80} />
      </Row>
      <div style={{ maxWidth: 350, minWidth: 220, marginTop: 8, display: 'flex', gap: 8 }}>
        <Button variant="primary" type="submit" style={{ width: isADM ? '50%' : '100%' }}>{isEditing ? 'Atualizar' : 'Cadastrar'}</Button>
        {isEditing && (
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
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
            <p>Tem certeza que deseja excluir esta unidade?</p>
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
export default UnidadeForm;
