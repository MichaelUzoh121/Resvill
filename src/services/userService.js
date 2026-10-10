  import api from "./api";


  /**
   * Get currently authenticated user's profile
   */
  export const getProfile = async () => {
    const response = await api.get("/users/profile");

    return response.data;
  };


  /**
   * Update user profile information
   */
  export const updateProfile = async (payload) => {
    const response = await api.patch(
      "/users/profile",
      payload
    );

    return response.data;
  };


  /**
   * Change account password
   */
  export const changePassword = async (payload) => {
    const response = await api.patch(
      "/users/password",
      payload
    );

    return response.data;
  };


  /**
   * Delete user account
   */
  export const deleteAccount = async () => {
    const response = await api.delete(
      "/users/account"
    );

    return response.data;
  };