import { useMutation, useQuery } from "@tanstack/react-query";

import { initializePayment, verifyPayment } from "../services/paymentService";

export const useInitializePayment = (options = {}) => {
  return useMutation({
    mutationFn: initializePayment,
    ...options,
  });
};

export const useVerifyPayment = (options = {}) => {
  return useMutation({
    mutationFn: verifyPayment,
    ...options,
  });
};
