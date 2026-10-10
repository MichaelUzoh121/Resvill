import api from "./api";

export const createContactMessage = async (contactData) => {
  const payload = {
    name: String(contactData.name || "").trim(),
    email: String(contactData.email || "").trim(),
    phone: String(contactData.phone || "").trim(),
    subject: String(contactData.subject || "").trim(),
    message: String(contactData.message || "").trim(),
  };

  const response = await api.post("/contact", payload);
  return response.data;
};
