import React, { useState, useEffect } from 'react';
import FormGenerator from '../../components/FormGenerator';
import campusService from '../../services/campus/service';
import unidadeService from '../../services/unidadeorganizacional/service';

const LocalEstocagemForm = ({ onSubmit, initialData = {}, isEditing, isADM = true, onCancel, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    codcampus: '',
    codunidade: '',
    codpredio: '',
    codlaboratorio: '',
    nomlocal: ''
  });
  const [campi, setCampi] = useState([]);
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    campusService.listar().then(setCampi);
  }, []);

  useEffect(() => {
    if (formData.codcampus) {
      unidadeService.listarPorCampus(formData.codcampus).then(setUnidades);
    } else {
      setUnidades([]);
      setFormData(prev => ({ ...prev, codunidade: '' }));
    }
  }, [formData.codcampus]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        codcampus: initialData.codcampus ? String(initialData.codcampus) : '',
        codunidade: initialData.codunidade ? String(initialData.codunidade) : '',
        codpredio: initialData.codpredio ? String(initialData.codpredio) : '',
        codlaboratorio: initialData.codlaboratorio ? String(initialData.codlaboratorio) : '',
        nomlocal: initialData.nomlocal ? String(initialData.nomlocal) : ''
      }));
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
    onSubmit({ ...formData });
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
    {
      label: 'Campus',
      name: 'codcampus',
      required: true,
      type: 'select',
      options: campi.map(c => ({ value: String(c.codcampus), label: `${c.codcampus} - ${c.nomcampus}` })),
      disabled: isEditing
    },
    {
      label: 'Unidade Organizacional',
      name: 'codunidade',
      required: true,
      type: 'select',
      options: unidades.map(u => ({ value: String(u.codunidade), label: `${u.codunidade} - ${u.nomunidade}` })),
      disabled: isEditing
    },
    {
      label: 'Código Prédio',
      name: 'codpredio',
      required: true,
      maxLength: 2,
      disabled: isEditing
    },
    {
      label: 'Código Laboratório',
      name: 'codlaboratorio',
      required: true,
      maxLength: 3,
      disabled: isEditing
    },
    {
      label: 'Local',
      name: 'nomlocal',
      required: true,
      maxLength: 100,
      disabled: false
    }
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
      onDelete={isADM ? handleDelete : undefined}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      onConfirmDelete={handleConfirmDelete}
    />
  );
};
export default LocalEstocagemForm;
