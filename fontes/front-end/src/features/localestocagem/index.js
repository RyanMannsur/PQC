import { useState, useEffect } from 'react';
import { Button, Input, InputSelect } from '../../components';
import { Form, Row } from '../../pages/localestocagem/styles';
import campusService from '../../services/campus/service';
import unidadeService from '../../services/unidadeorganizacional/service';

const LocalEstocagemForm = ({ onSubmit, initialData = {}, isEditing, isADM = true, onCancel, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    codcampus: '',
    codunidade: '',
    codpredio: '',
    codlaboratorio: '',
    nomlocal: ''
  });
  const [campi, setCampi] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [isUnidadeDisabled, setIsUnidadeDisabled] = useState(true);

  useEffect(() => {
    campusService.listar().then(setCampi);
  }, []);

  useEffect(() => {
    if (formData.codcampus) {
      unidadeService.listarPorCampus(formData.codcampus).then(setUnidades);
      setIsUnidadeDisabled(false);
    } else {
      setUnidades([]);
      setIsUnidadeDisabled(true);
      setFormData(prev => ({ ...prev, codunidade: '' }));
    }
  }, [formData.codcampus]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        codcampus: initialData.codcampus ? String(initialData.codcampus) : '',
        codunidade: initialData.codunidade ? String(initialData.codunidade) : '',
        codpredio: initialData.codpredio ? String(initialData.codpredio) : '',
        codlaboratorio: initialData.codlaboratorio ? String(initialData.codlaboratorio) : '',
        nomlocal: initialData.nomlocal ? String(initialData.nomlocal) : ''
      }));
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
          onChange={value => {
            setFormData({ ...formData, codcampus: value, codunidade: '' });
          }}
          required
          disabled={isEditing}
        />
      </Row>
      <Row>
        <label>Unidade Organizacional:</label>
        <InputSelect
          name="codunidade"
          value={formData.codunidade ? String(formData.codunidade) : ""}
          options={unidades.map(u => ({ value: String(u.codunidade), label: `${u.codunidade} - ${u.nomunidade}` }))}
          onChange={value => setFormData({ ...formData, codunidade: value })}
          required
          disabled={isUnidadeDisabled || isEditing}
        />
      </Row>
      <Row>
        <label>Código Prédio:</label>
        <Input name="codpredio" value={formData.codpredio} onChange={handleChange} required maxLength={2} />
      </Row>
      <Row>
        <label>Código Laboratório:</label>
        <Input name="codlaboratorio" value={formData.codlaboratorio} onChange={handleChange} required maxLength={3} />
      </Row>
      <Row>
        <label>Nome Local:</label>
        <Input name="nomlocal" value={formData.nomlocal} onChange={handleChange} required maxLength={100} />
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
            <p>Tem certeza que deseja excluir este local de estocagem?</p>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              <Button variant="danger" type="button" onClick={() => { 
                setShowDeleteModal(false); 
                if (typeof onDelete === 'function') { 
                  onDelete(); 
                  window.location.reload(); 
                } 
              }}>Excluir</Button>
              <Button variant="secondary" type="button" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
export default LocalEstocagemForm;
