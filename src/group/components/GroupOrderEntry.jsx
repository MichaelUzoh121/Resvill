import React from "react";
import { useParams } from "react-router-dom";

import GroupOrder from "../GroupOrder";
import GroupOrderWorkspace from "./GroupOrderWorkspace";
import { getGroupParticipant } from "../../utils/groupOrderStorage";

function GroupOrderEntry() {
  const { groupCode } = useParams();

  const participant = getGroupParticipant();

  const normalizedUrlCode = groupCode?.trim().toUpperCase();
  const normalizedSavedCode = participant?.groupCode?.trim().toUpperCase();

  const hasAccessToThisGroup =
    participant &&
    normalizedSavedCode === normalizedUrlCode;

  if (hasAccessToThisGroup) {
    return <GroupOrderWorkspace />;
  }

  return <GroupOrder />;
}

export default GroupOrderEntry;