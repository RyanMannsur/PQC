import labsData from "./labs.json";

export const getLabsByToken = (token) => {
  if (labsData.token === token) {
    return labsData.labs;
  } else {
    return [];
  }
};

export const getLabById = (id) => {
  const lab = labsData.labs.find((lab) => lab.id === Number(id));
  return lab || null;
};
