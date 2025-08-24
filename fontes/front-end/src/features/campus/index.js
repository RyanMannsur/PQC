
import FormGenerator from '../../components/FormGenerator';

const CampusForm = ({ onSubmit, isEditing, onCancel, formData, onChange, editCancelText, statusMessage, onCloseMessage} ) => {
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    { label: 'Código Campus', name: 'codCampus', required: true, maxLength: 2, disabled: isEditing },
    { label: 'Nome Campus', name: 'nomCampus', required: true, maxLength: 30 }
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

export default CampusForm;
