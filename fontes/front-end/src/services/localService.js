import api from './api';


export const getLocais = async () => {
  const response = await api.get('/localestocagem');
  return response.data.map(l => ({
    codcampus: l[0],
    codunidade: l[1],
    codpredio: l[2],
    codlaboratorio: l[3],
    nomlocal: l[4]
  }));
};

export const createLocal = async (local) => {
  const payload = {
    codcampus: local.codcampus,
    codunidade: local.codunidade,
    codpredio: local.codpredio,
    codlaboratorio: local.codlaboratorio,
    nomlocal: local.nomlocal
  };
  const response = await api.post('/localestocagem', payload);
  return response.data;
};

export const updateLocal = async (local) => {
  const payload = {
    codcampus: local.codcampus,
    codunidade: local.codunidade,
    codpredio: local.codpredio,
    codlaboratorio: local.codlaboratorio,
    nomlocal: local.nomlocal
  };
  const url = `/localestocagem/${local.codcampus}/${local.codunidade}/${local.codpredio}/${local.codlaboratorio}`;
  const response = await api.put(url, payload);
  return response.data;
};

export const deleteLocal = async (local) => {
  const url = `/localestocagem/${local.codcampus}/${local.codunidade}/${local.codpredio}/${local.codlaboratorio}`;
  const response = await api.delete(url);
  return response.data;
};
