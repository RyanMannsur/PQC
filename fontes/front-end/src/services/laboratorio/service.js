import labsData from "./labs.json";

export const getLabsByCpf = (cpf) => {
  const userLabs = labsData.find((user) => user.cpf === cpf);

  if (userLabs) {
    return userLabs.labs;
  } else {
    return [];
  }
};
