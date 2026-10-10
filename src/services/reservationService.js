import api from "./api";

export const createReservation = async (reservationData) => {
  const payload = {
    name: String(reservationData.name || "").trim(),
    phone: String(reservationData.phone || "").trim(),
    email: String(reservationData.email || "").trim(),
    guests: Number(reservationData.guests),
    date: String(reservationData.date || "").trim(),
    time: String(reservationData.time || "").trim(),
  };

  const response = await api.post("/reservations", payload);
  return response.data;
};
