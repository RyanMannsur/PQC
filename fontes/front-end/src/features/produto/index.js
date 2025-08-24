import FormGenerator from '../../components/FormGenerator';
import { ScrollArea } from './styles';

const ProdutoForm = ({ 
     onSubmit,
     isEditing,
     onCancel, 
     formData,
     onChange,
     editCancelText,
     statusMessage,
     onCloseMessage,
     allOrgaosControle = [],
     handleOrgaoChange
  }) => {
  
    const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fields = [
    { label: 'Nome', name: 'nomProduto', required: true },
    { label: 'Lista', name: 'nomLista', required: true },
    { label: 'Pureza', name: 'perPureza', type: 'number' },
    { label: 'Densidade', name: 'vlrDensidade', type: 'number' },
    { label: 'NCM', name: 'ncm', maxLength: 8, placeholder: 'NCM (8 dígitos)' },
    { label: 'Ativo', name: 'idtAtivo', type: 'checkbox' },
    { 
      label: 'Produto controlado por', 
      name: 'orgaosControle', 
      type: 'checkboxList',
      options: allOrgaosControle,
      onChange: handleOrgaoChange, 
      renderWrapper: (children) => <ScrollArea>{children}</ScrollArea>
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
 )
};


export default ProdutoForm;