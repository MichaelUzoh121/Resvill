import { useMutation } from "@tanstack/react-query";
import {
  acceptDelivery,
  declineDelivery,
  pickupDelivery,
  startDelivery,
  completeDelivery,
  failDelivery,
  updateDriverLocation,
} from "../services/driverService";

export const useAcceptDelivery = (options = {}) => {
  return useMutation({
    mutationFn: acceptDelivery,
    ...options,
  });
};

export const useDeclineDelivery = (options = {}) => {
  return useMutation({
    mutationFn: declineDelivery,
    ...options,
  });
};

export const usePickupDelivery = (options = {}) => {
  return useMutation({
    mutationFn: pickupDelivery,
    ...options,
  });
};

export const useStartDelivery = (options = {}) => {
  return useMutation({
    mutationFn: startDelivery,
    ...options,
  });
};

export const useCompleteDelivery = (options = {}) => {
  return useMutation({
    mutationFn: completeDelivery,
    ...options,
  });
};

export const useFailDelivery = (options = {}) => {
  return useMutation({
    mutationFn: ({ deliveryId, data }) =>
      failDelivery(deliveryId, data),
    ...options,
  });
};

export const useUpdateDriverLocation = (options = {}) => {
  return useMutation({
    mutationFn: ({ deliveryId, location }) =>
      updateDriverLocation(deliveryId, location),
    ...options,
  });
};