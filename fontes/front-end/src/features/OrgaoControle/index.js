import FormGenerator from '../../components/FormGenerator';

const OrgaoControleForm = ({ onSubmit, isEditing, onCancel, formData, onChange, editCancelText, statusMessage, onCloseMessage }) => {
  
  // Lida com o envio do formulário
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  
  // Definição dos campos do formulário para o FormGenerator
  const fields = [
    {
        label: 'Código',
        name: 'codOrgaoControle',
        type: 'number',
        disabled: isEditing, // Desabilita o campo se estiver editando
        hidden: !isEditing // Oculta o campo no modo de criação
    },
    { 
      label: 'Orgão Controle', 
      name: 'nomOrgaoControle', 
      required: true, 
      maxLength: 50 
    }
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

export default OrgaoControleForm;

