import api from "./api";

export const createContactMessage = async (contactData) => {
  const payload = {
    name: String(contactData.name || "").trim(),
    email: String(contactData.email || "").trim(),
    phone: String(contactData.phone || "").trim(),
    subject: String(contactData.subject || "").trim(),
    message: String(contactData.message || "").trim(),
  };

  try {
    const response = await api.post("/contact", payload);
    return response.data;
  } catch (error) {
    const validationMessages = Object.values(error?.data?.errors || {}).filter(
      (message) => typeof message === "string" && message.trim(),
    );

    if (validationMessages.length > 0) {
      throw {
        ...error,
        message: validationMessages.join(" "),
      };
    }

    throw error;
  }
};
