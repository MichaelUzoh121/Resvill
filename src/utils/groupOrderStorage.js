const GROUP_ORDER_STORAGE_KEY =
  "resvill_group_order_participant";

export const saveGroupParticipant = ({
  groupCode,
  groupOrderId,
  participantId,
  participantToken,
}) => {
  const participant = {
    groupCode,
    groupOrderId,
    participantId,
    participantToken,
  };

  localStorage.setItem(
    GROUP_ORDER_STORAGE_KEY,
    JSON.stringify(participant),
  );

  return participant;
};

export const getGroupParticipant = () => {
  try {
    const stored = localStorage.getItem(
      GROUP_ORDER_STORAGE_KEY,
    );

    if (!stored) {
      return null;
    }

    const participant = JSON.parse(stored);

    if (
      !participant?.groupCode ||
      !participant?.groupOrderId ||
      !participant?.participantId ||
      !participant?.participantToken
    ) {
      return null;
    }

    return participant;
  } catch {
    return null;
  }
};

export const clearGroupParticipant = () => {
  localStorage.removeItem(
    GROUP_ORDER_STORAGE_KEY,
  );
};

export const hasGroupParticipantSession = () => {
  return Boolean(getGroupParticipant());
};