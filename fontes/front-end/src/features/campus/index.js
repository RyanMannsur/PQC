import { useState, useEffect } from 'react';
import FormGenerator from '../../components/FormGenerator';

const CampusForm = ({ onSubmit, initialData = {}, isEditing, isADM = true, onCancel, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    codcampus: '',
    nomcampus: ''
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
    const { codcampus, nomcampus } = formData;
    onSubmit({ codcampus, nomcampus });
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
    { label: 'Código Campus', name: 'codcampus', required: true, maxLength: 2, disabled: isEditing },
    { label: 'Nome Campus', name: 'nomcampus', required: true, maxLength: 30 }
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
export default CampusForm;
