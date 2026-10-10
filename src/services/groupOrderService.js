import api from "./api";

export const createGroupOrder = async (groupData) => {
  const response = await api.post("/group-orders", groupData);
  return response.data;
};

export const joinGroupOrder = async (groupData) => {
  const response = await api.post("/group-orders/join", groupData);

  return response.data;
};

export const getGroupOrder = async (groupCode) => {
  const response = await api.get(`/group-orders/${groupCode}`);

  return response.data;
};

export const accessGroupOrder = async (groupOrderId, participantData) => {
  const response = await api.post(
    `/group-orders/${groupOrderId}/access`,
    participantData,
  );

  return response.data;
};

export const getGroupOrderSummary = async (groupOrderId, participantData) => {
  const response = await api.post(
    `/group-orders/${groupOrderId}/summary`,
    participantData,
  );

  return response.data;
};

export const addGroupOrderItem = async (groupOrderId, itemData) => {
  const response = await api.post(
    `/group-orders/${groupOrderId}/items`,
    itemData,
  );

  return response.data;
};

export const updateGroupOrderItem = async (groupOrderId, itemId, itemData) => {
  const response = await api.patch(
    `/group-orders/${groupOrderId}/items/${itemId}`,
    itemData,
  );

  return response.data;
};

export const removeGroupOrderItem = async (
  groupOrderId,
  itemId,
  participantData,
) => {
  const response = await api.delete(
    `/group-orders/${groupOrderId}/items/${itemId}`,
    {
      data: participantData,
    },
  );

  return response.data;
};

export const lockGroupOrder = async (groupOrderId, participantData) => {
  const response = await api.post(
    `/group-orders/${groupOrderId}/lock`,
    participantData,
  );

  return response.data;
};

export const checkoutGroupOrder = async (groupOrderId, checkoutData) => {
  const response = await api.post(
    `/group-orders/${groupOrderId}/checkout`,
    checkoutData,
  );

  return response.data;
};

export const cancelGroupOrder = async (groupOrderId, participantData) => {
  const response = await api.post(
    `/group-orders/${groupOrderId}/cancel`,
    participantData,
  );

  return response.data;
};

export const updateGroupOrderName = async (groupOrderId, nameData) => {
  const response = await api.patch(
    `/group-orders/${groupOrderId}/name`,
    nameData,
  );

  return response.data;
};

export const leaveGroupOrder = async (groupOrderId, participantData) => {
  const response = await api.post(
    `/group-orders/${groupOrderId}/leave`,
    participantData,
  );

  return response.data;
};

export const transferGroupOrderHost = async (groupOrderId, hostData) => {
  const response = await api.post(
    `/group-orders/${groupOrderId}/transfer-host`,
    hostData,
  );

  return response.data;
};
