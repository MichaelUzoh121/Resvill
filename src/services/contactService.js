import api from "./api";

export const createContactMessage = async (contactData) => {
  const response = await api.post("/contact", contactData);

  return response.data;
};
