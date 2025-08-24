// src/pages/UsuarioForm.js

import FormGenerator from '../../components/FormGenerator';

const UsuarioForm = ({ onSubmit, isEditing, onCancel, formData, onChange, editCancelText, statusMessage, onCloseMessage} ) => {
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    {
      label: 'CPF',
      name: 'codCPF',
      required: true,
      maxLength: 11,
      disabled: isEditing,
    },
    {
      label: 'Nome',
      name: 'nomUsuario',
      required: true,
      maxLength: 50,
    },
    {
      label: 'Tipo de Usuário',
      name: 'idtTipoUsuario',
      required: true,
      type: 'select',
      options: [
        { value: 'A', label: 'Administrador' },
        { value: 'R', label: 'Usuário Padrão' },
      ],
      disabled: false,
    },
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

export default UsuarioForm;