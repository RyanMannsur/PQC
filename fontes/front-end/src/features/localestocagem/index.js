// LocalEstocagemForm.js

import FormGenerator from '../../components/FormGenerator';

const LocalEstocagemForm = ({
  onSubmit,
  isEditing,
  onCancel,
  formData,
  onChange,
  editCancelText, 
  statusMessage, 
  onCloseMessage,
  campi,
  unidades,
  responsaveis,
  
}) => {

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
      options: campi.map((c) => ({ value: String(c.codCampus), label: `${c.codCampus} - ${c.nomCampus}` })),
      disabled: isEditing
    },
    {
      label: 'Unidade Organizacional',
      name: 'codUnidade',
      required: true,
      type: 'select',
      options: unidades.map((u) => ({ value: String(u.codUnidade), label: `${u.codUnidade} - ${u.nomUnidade}` })),
      disabled: isEditing || !formData.codCampus
    },
    {
      label: 'Código Prédio',
      name: 'codPredio',
      required: true,
      maxLength: 2,
      disabled: isEditing || !formData.codUnidade
    },
    {
      label: 'Código Laboratório',
      name: 'codLaboratorio',
      required: true,
      maxLength: 3,
      disabled: isEditing || !formData.codPredio,
    },
    {
      label: 'Nome Local',
      name: 'nomLocal',
      required: true,
      maxLength: 100,
      disabled: false,
    },
    {
      label: 'Responsável',
      name: 'codCPFResponsavel',
      required: true,
      type: 'select',
      options: responsaveis.map((u) => ({ value: String(u.codCPFResponsavel), label: `${u.codCPFResponsavel} - ${u.nomUsuario}` })),
      disabled: isEditing || !formData.codCampus,
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

export default LocalEstocagemForm;
