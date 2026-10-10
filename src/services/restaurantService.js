// import api from "./api";

// export const getCurrentRestaurant = async () => {
//   const response = await api.get("/restaurants/current");

//   return response.data;
// };

import api from "./api";

export const getCurrentRestaurant = async () => {
  const response = await api.get("/restaurants/current");

  return response.data.data;
};