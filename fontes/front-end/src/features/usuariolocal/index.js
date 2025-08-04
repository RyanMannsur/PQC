import React, { useState, useEffect } from 'react';
import FormGenerator from '../../components/FormGenerator';
import * as usuarioService from '../../services/auth/service';

const UsuarioLocalForm = ({ onSubmit, initialData = {}, isEditing, isADM = true, onCancel, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    cpf: '',
    locaisGerenciados: []
  });
  const [locaisUsuario, setLocaisUsuario] = useState([]);

  useEffect(() => {
    // Aqui deveria buscar todos os locais disponíveis do sistema, se existir rota
    // Se não existir, só busca os locais do usuário
  }, []);

  useEffect(() => {
    if (initialData && initialData.id) {
      usuarioService.listarLocaisEstocagemUsuario(initialData.id).then(setLocaisUsuario);
    } else {
      setLocaisUsuario([]);
      setFormData(prev => ({ ...prev, locaisGerenciados: [] }));
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        cpf: initialData.cpf ? String(initialData.cpf) : '',
        locaisGerenciados: initialData.locaisGerenciados || []
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

  const handleSelectChange = e => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setFormData({
      ...formData,
      locaisGerenciados: options
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
      label: 'CPF do Usuário',
      name: 'cpf',
      required: true,
      type: 'text',
      disabled: isEditing
    },
    {
      label: 'Locais de Estocagem do Usuário',
      name: 'locaisGerenciados',
      required: false,
      type: 'select',
      options: locaisUsuario.map(l => ({ value: l.codLaboratorio, label: `${l.codLaboratorio} - ${l.nomLocal}` })),
      multiple: true,
      onChange: handleSelectChange,
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

export default UsuarioLocalForm;
