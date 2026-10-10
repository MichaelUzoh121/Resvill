import { useMemo } from "react";

import {
  getGroupParticipant,
} from "../utils/groupOrderStorage";

export const useGroupOrderSession = () => {
  const session = useMemo(
    () => getGroupParticipant(),
    [],
  );

  return {
    session,

    hasSession: Boolean(session),

    groupCode:
      session?.groupCode || null,

    groupOrderId:
      session?.groupOrderId || null,

    participantId:
      session?.participantId || null,

    participantToken:
      session?.participantToken || null,
  };
};