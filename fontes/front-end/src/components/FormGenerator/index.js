import { Button, Input, InputSelect } from '../';
import { Row } from './styles';
import StatusMessage from '../StatusMensagem';

const FormGenerator = ({
  fields,
  formData,
  onChange,
  onSubmit,
  isEditing,
  onCancel,
  editCancelText,
  statusMessage, 
  onCloseMessage
}) => {
  return (
    <form onSubmit={onSubmit}> {/*  O evento onSubmit do formulário agora usa a prop */}
      {fields.map((field, index) => {
        const inputId = `${field.name}-${index}`;
 
        return (
          <Row key={inputId}>
            <label htmlFor={inputId}>{field.label}:</label>

              {field.type === 'select' ? (
                <InputSelect
                  id={inputId}
                  name={field.name}
                  value={formData[field.name] ?? ''}
                  options={field.options || []}
                  onChange={(value) =>
                    onChange({ target: { name: field.name, value, type: 'select-one' } })
                  }
                  required={field.required}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  readOnly={field.readOnly}
                  style={field.style}
                />

                ) : field.type === 'checkbox' ? (
                  <input
                    id={inputId}
                    type="checkbox"
                    name={field.name}
                    checked={!!formData[field.name]}
                    onChange={onChange}
                    disabled={field.disabled}
                  />

                ) : field.type === 'checkboxList' ? (
                  field.options && field.options.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                      {field.options.map((item) => (
                        <li key={item.codOrgaoControle} style={{ marginBottom: '10px' }}>
                          <label>
                            <input
                              id={`${field.name}-${item.codOrgaoControle}`}
                              type="checkbox"
                              checked={Array.isArray(formData.orgaosControle) && formData.orgaosControle.some(o => o.codOrgaoControle === item.codOrgaoControle)}
                              onChange={(e) =>
                                field.onChange(item.codOrgaoControle, e.target.checked)
                              }
                            />
                            {item.nomOrgaoControle}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nenhum órgão de controle encontrado.</p>
                  )
                ) : (
                  <Input
                    id={inputId}
                    name={field.name}
                    value={formData[field.name] ?? ''}
                    onChange={onChange}
                    type={field.type || 'text'}
                    required={field.required}
                    maxLength={field.maxLength}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    readOnly={field.readOnly}
                    style={field.style}
                  />
                )}
              </Row>
            );
          })}

          <div style={{ maxWidth: 350, minWidth: 220, marginTop: 8, display: 'flex', gap: 8 }}>
            <Button $variant="primary" type="submit" style={{ width: '100%' }}>
              {isEditing ? 'Atualizar' : 'Cadastrar'}
            </Button>
            <Button
              $variant="secondary"
              type="button"
              onClick={onCancel}
              style={{ width: '100%' }}
            >
              {typeof editCancelText === 'string' ? editCancelText : (isEditing ? 'Cancelar' : 'Limpar')}
            </Button>
          </div>
          {/* RENDERIZA O STATUS MESSAGE AQUI */}
          {statusMessage && (
          <StatusMessage
            message={statusMessage}
            onClose={onCloseMessage}
          />
        )}
      </form>
    )
  }

export default FormGenerator;
