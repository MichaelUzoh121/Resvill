import { useMutation } from "@tanstack/react-query";

import {
  updateStaffProfile,
  changeStaffPassword,
} from "../services/staffService";

export const useUpdateStaffProfile = () => {
  return useMutation({
    mutationFn: updateStaffProfile,
  });
};

export const useChangeStaffPassword = () => {
  return useMutation({
    mutationFn: changeStaffPassword,
  });
};