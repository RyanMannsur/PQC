
import FormGenerator from '../../components/FormGenerator';

const UnidadeOrganizacionalForm = ({ onSubmit, isEditing, onCancel, formData, onChange, editCancelText, statusMessage, onCloseMessage, campi} ) => {
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  
  const fields = [
    {
      label: 'Campus',
      name: 'codCampus',
      required: true,
      type: 'select',
      disabled: isEditing,
      options: (campi || []).map(c => ({ 
        value: String(c.codCampus),
        label: `${c.codCampus} - ${c.nomCampus}`
      }))     
    },
    {
      label: 'Código Unidade',
      name: 'codUnidade',
      required: true,
      type: 'text',
      disabled: isEditing,
    },
    { label: 'Sigla Unidade', name: 'sglUnidade', required: true, maxLength: 10 },
    { label: 'Nome Unidade', name: 'nomUnidade', required: true, maxLength: 80 }
  ];

  return (
    <FormGenerator
      fields={fields}
      formData={formData}
      onChange={onChange}
      onSubmit={handleSubmit}
      isEditing={isEditing}
      onCancel={onCancel}
      editCancelText={editCancelText}
      statusMessage={statusMessage} 
      onCloseMessage={onCloseMessage}
    />
  );
};
export default UnidadeOrganizacionalForm;
