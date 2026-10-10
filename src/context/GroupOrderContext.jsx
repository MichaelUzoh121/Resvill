import React, { useState, createContext, useContext, useMemo } from "react";

import {
  getGroupParticipant,
  clearGroupParticipant,
} from "../utils/groupOrderStorage";

import {
  useGroupOrder,
  useAccessGroupOrder,
  useUpdateGroupOrderName,
  useLeaveGroupOrder,
  useTransferGroupOrderHost,
} from "../hooks/useGroupOrder";

const GroupOrderContext = createContext(null);

// export const GroupOrderProvider = ({ children }) => {
export const GroupOrderProvider = ({ children, groupCode }) => {
  const participant = getGroupParticipant();

  const accessMutation = useAccessGroupOrder();

  const leaveGroupOrderMutation = useLeaveGroupOrder();

  const transferGroupOrderHostMutation = useTransferGroupOrderHost();

  const [sessionInvalid, setSessionInvalid] = useState(false);

  const updateGroupOrderNameMutation = useUpdateGroupOrderName();

  //   const validateSession = async () => {
  //     if (
  //       !participant?.groupOrderId ||
  //       !participant?.participantId ||
  //       !participant?.participantToken
  //     ) {
  //       return null;
  //     }

  //     return accessMutation.mutateAsync({
  //       groupOrderId: participant.groupOrderId,
  //       participantData: {
  //         participantId: participant.participantId,
  //         participantToken: participant.participantToken,
  //       },
  //     });
  //   };

  const validateSession = async () => {
    if (
      !participant?.groupOrderId ||
      !participant?.participantId ||
      !participant?.participantToken
    ) {
      return null;
    }

    try {
      const result = await accessMutation.mutateAsync({
        groupOrderId: participant.groupOrderId,
        participantData: {
          participantId: participant.participantId,
          participantToken: participant.participantToken,
        },
      });

      setSessionInvalid(false);

      return result;
    } catch (error) {
      clearGroupParticipant();
      setSessionInvalid(true);
      throw error;
    }
  };

  //   const { groupOrder, isLoading, isError, error, refetchGroupOrder } =
  //     useGroupOrder(participant?.groupCode);

  const activeGroupCode =
    groupCode?.trim().toUpperCase() ||
    participant?.groupCode?.trim().toUpperCase() ||
    "";

  const { groupOrder, isLoading, isError, error, refetchGroupOrder } =
    useGroupOrder(activeGroupCode);

  const currentParticipant = useMemo(() => {
    if (!groupOrder || !participant?.participantId) {
      return null;
    }

    return (
      groupOrder.participants?.find(
        (item) =>
          item._id?.toString() === participant.participantId?.toString(),
      ) || null
    );
  }, [groupOrder, participant?.participantId]);

  const isHost = Boolean(currentParticipant?.isHost);

  const isParticipant = Boolean(currentParticipant);

  const canManageGroup = isHost && groupOrder?.status === "open";

  const canAddItems = isParticipant && groupOrder?.status === "open";

  const canEditItems = isParticipant && groupOrder?.status === "open";

  const canCheckout = isHost && groupOrder?.status === "locked";

  const canCancel = isHost && ["open", "locked"].includes(groupOrder?.status);

  const leaveGroup = async () => {
    if (
      !participant?.groupOrderId ||
      !participant?.participantId ||
      !participant?.participantToken
    ) {
      clearGroupParticipant();
      return;
    }

    await leaveGroupOrderMutation.mutateAsync({
      groupOrderId: participant.groupOrderId,
      participantData: {
        participantId: participant.participantId,
        participantToken: participant.participantToken,
      },
    });

    clearGroupParticipant();
  };
  const updateName = async (name) => {
    if (
      !participant?.groupOrderId ||
      !participant?.participantId ||
      !participant?.participantToken
    ) {
      throw new Error("Group session is unavailable.");
    }

    return updateGroupOrderNameMutation.mutateAsync({
      groupOrderId: participant.groupOrderId,
      groupCode: participant.groupCode,
      nameData: {
        participantId: participant.participantId,
        participantToken: participant.participantToken,
        name,
      },
    });
  };

  const transferHost = async (newHostParticipantId) => {
    if (
      !participant?.groupOrderId ||
      !participant?.participantId ||
      !participant?.participantToken
    ) {
      throw new Error("Group session is unavailable.");
    }

    if (!isHost) {
      throw new Error("Only the current host can transfer host ownership.");
    }

    return transferGroupOrderHostMutation.mutateAsync({
      groupOrderId: participant.groupOrderId,
      groupCode: participant.groupCode,
      hostData: {
        participantId: participant.participantId,
        participantToken: participant.participantToken,
        newHostParticipantId,
      },
    });
  };

  const value = useMemo(
    () => ({
      groupOrder,
      participant,
      currentParticipant,

      groupOrderId: participant?.groupOrderId || null,
      //   groupCode: participant?.groupCode || null,
      groupCode: activeGroupCode || null,
      participantId: participant?.participantId || null,
      participantToken: participant?.participantToken || null,

      isHost,
      isParticipant,

      canManageGroup,
      canAddItems,
      canEditItems,
      canCheckout,
      canCancel,

      validateSession,
      isValidatingSession: accessMutation.isPending,

      updateName,
      isUpdatingName: updateGroupOrderNameMutation.isPending,

      transferHost,
      isTransferringHost: transferGroupOrderHostMutation.isPending,

      isLoading,
      isError,
      error,
      sessionInvalid,

      refetchGroupOrder,
      leaveGroup,
      isLeavingGroup: leaveGroupOrderMutation.isPending,
    }),
    [
      groupOrder,
      participant,
      currentParticipant,
      isHost,
      isParticipant,
      canManageGroup,
      canAddItems,
      canEditItems,
      canCheckout,
      canCancel,
      validateSession,
      accessMutation.isPending,
      updateName,
      updateGroupOrderNameMutation.isPending,
      transferHost,
      transferGroupOrderHostMutation.isPending,
      isLoading,
      isError,
      error,
      sessionInvalid,
      refetchGroupOrder,
    ],
  );

  return (
    <GroupOrderContext.Provider value={value}>
      {children}
    </GroupOrderContext.Provider>
  );
};

export const useGroupOrderContext = () => {
  const context = useContext(GroupOrderContext);

  if (!context) {
    throw new Error(
      "useGroupOrderContext must be used within GroupOrderProvider",
    );
  }

  return context;
};
