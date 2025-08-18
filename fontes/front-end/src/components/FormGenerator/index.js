import { Button, Input, InputSelect } from '../';
import { Row } from './styles';

const FormGenerator = ({ fields, formData, onChange, onSubmit, isEditing, isADM = true, onCancel, onDelete, showDeleteModal, setShowDeleteModal, onConfirmDelete }) => (
  <form onSubmit={onSubmit}>
    {fields.map(field => (
      <Row key={field.name}>
        <label>{field.label}:</label>
        {field.type === 'select' ? (
          <InputSelect
            name={field.name}
            value={formData[field.name]}
            options={field.options || []}
            onChange={value => {
              onChange({ target: { name: field.name, value, type: 'select-one' } });
            }}
            required={field.required}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        ) : (
          <Input
            name={field.name}
            value={formData[field.name]}
            onChange={onChange}
            type={field.type || 'text'}
            required={field.required}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            disabled={field.disabled}
          />
        )}
      </Row>
    ))}
    <div style={{ maxWidth: 350, minWidth: 220, marginTop: 8, display: 'flex', gap: 8 }}>
      <Button $variant="primary" type="submit" style={{ width: isADM ? '50%' : '100%' }}>{isEditing ? 'Atualizar' : 'Cadastrar'}</Button>
      <Button
        $variant="secondary"
        type="button"
        onClick={onCancel}
        style={{ width: isADM ? '50%' : '100%' }}
      >{typeof editCancelText === 'string' ? editCancelText : (isEditing ? 'Cancelar' : 'Cancelar')}</Button>
      {isADM && isEditing ? (
        <Button $variant="danger" type="button" onClick={onDelete} style={{ width: '25%' }}>Excluir</Button>
      ) : null}
    </div>
    {showDeleteModal && (
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 300, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <h3>Confirmar Exclusão</h3>
          <p>Tem certeza que deseja excluir este registro?</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            <Button $variant="danger" type="button" onClick={typeof onConfirmDelete === 'function' ? onConfirmDelete : onDelete}>Excluir</Button>
            <Button $variant="secondary" type="button" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          </div>
        </div>
      </div>
    )}
  </form>
);

export default FormGenerator;
