import labsData from "./labs.json";

export const getLabsByToken = (token) => {
  if (labsData.token === token) {
    return labsData.labs;
  } else {
    return [];
  }
};
