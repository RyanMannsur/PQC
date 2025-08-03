import { useState, useEffect } from 'react';
import FormGenerator from '../../components/FormGenerator';
import campusService from '../../services/campus/service';

const UnidadeForm = ({ onSubmit, initialData = {}, isEditing, isADM = true, onCancel, onDelete }) => {
  useEffect(() => {
    if (!isEditing) {
      setFormData({
        codcampus: '',
        codunidade: '',
        sglunidade: '',
        nomunidade: ''
      });
    }
  }, [isEditing]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    codcampus: '',
    codunidade: '',
    sglunidade: '',
    nomunidade: ''
  });
  const [campi, setCampi] = useState([]);

  useEffect(() => {
    campusService.listar().then(setCampi);
  }, []);

  useEffect(() => {
    if (initialData) {
      // Corrige se os campos vierem invertidos
      let codcampus = initialData.codcampus;
      let codunidade = initialData.codunidade;
      let sglunidade = initialData.sglunidade;
      let nomunidade = initialData.nomunidade;
      // Se codcampus vier com formato de unidade, e codunidade vier com formato de campus, inverte
      if (codcampus && codcampus.length > 2 && codunidade && codunidade.length <= 2) {
        [codcampus, codunidade] = [codunidade, codcampus];
      }
      if (sglunidade && sglunidade.length > 20 && nomunidade && nomunidade.length <= 10) {
        [sglunidade, nomunidade] = [nomunidade, sglunidade];
      }
      setFormData(prev => ({
        ...prev,
        codcampus: codcampus ? String(codcampus) : '',
        codunidade: codunidade ? String(codunidade) : '',
        sglunidade: sglunidade || '',
        nomunidade: nomunidade || ''
      }));
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'codcampus' ? String(value) : (type === 'checkbox' ? checked : value),
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const data = { ...formData, codcampus: formData.codcampus.trim() };
    onSubmit(data);
    window.location.reload();
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    if (typeof onDelete === 'function') {
      const data = { ...formData, codcampus: formData.codcampus.trim(), codunidade: formData.codunidade.trim() };
      onDelete(data.codcampus, data.codunidade);
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
      label: 'Código Unidade',
      name: 'codunidade',
      required: true,
      maxLength: 8,
      disabled: isEditing
    },
    { label: 'Sigla Unidade', name: 'sglunidade', required: true, maxLength: 10 },
    { label: 'Nome Unidade', name: 'nomunidade', required: true, maxLength: 80 }
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
export default UnidadeForm;
