import { useState, useEffect } from 'react';
import FormGenerator from '../../components/FormGenerator';

const ProdutoForm = ({ onSubmit, initialData = {}, isEditing, isADM = true, onCancel, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    nomProduto: '',
    nomLista: '',
    perPureza: '',
    vlrDensidade: '',
    idtAtivo: false,
    ncm: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { nomProduto, nomLista, perPureza, vlrDensidade, idtAtivo, ncm } = formData;
    onSubmit({ nomProduto, nomLista, perPureza, vlrDensidade, idtAtivo: false, ncm });
    window.location.reload();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (typeof onDelete === 'function') {
      onDelete();
      window.location.reload();
    }
  };

  const fields = [
    { label: 'Nome', name: 'nomProduto', required: true },
    { label: 'Lista', name: 'nomLista', required: true },
    { label: 'Pureza', name: 'perPureza', type: 'number' },
    { label: 'Densidade', name: 'vlrDensidade', type: 'number' },
    { label: 'NCM', name: 'ncm', maxLength: 8, placeholder: 'NCM (8 dígitos)' }
  ];

  return (
    <FormGenerator
      fields={fields}
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEditing={isEditing}
      isADM={isADM}
      onCancel={onCancel}
      onDelete={handleDelete}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      onConfirmDelete={handleConfirmDelete}
    />
  );
};
export default ProdutoForm;
