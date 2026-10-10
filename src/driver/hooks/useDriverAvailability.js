import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getDriverAvailability,
  setDriverOnline,
  setDriverOffline,
  setDriverAvailability,
} from "../services/driverService";

const DRIVER_AVAILABILITY_KEY = ["driver", "availability"];

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export function useDriverAvailability() {
  return useQuery({
    queryKey: DRIVER_AVAILABILITY_KEY,
    queryFn: getDriverAvailability,
    staleTime: 30 * 1000,
  });
}

export function useDriverOnline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDriverOnline,

    onSuccess: (response) => {
      queryClient.setQueryData(DRIVER_AVAILABILITY_KEY, response);
      queryClient.invalidateQueries({
        queryKey: ["driver", "dashboard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["driver", "offers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "active-deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "current-delivery"],
      });

      toast.success("You are now online.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDriverOffline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDriverOffline,

    onSuccess: (response) => {
      queryClient.setQueryData(DRIVER_AVAILABILITY_KEY, response);
      queryClient.invalidateQueries({
        queryKey: ["driver", "dashboard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["driver", "offers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "active-deliveries"],
      });

      queryClient.invalidateQueries({
        queryKey: ["driver", "current-delivery"],
      });

      toast.success("You are now offline.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useSetDriverAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDriverAvailability,

    onSuccess: (response) => {
      queryClient.setQueryData(DRIVER_AVAILABILITY_KEY, response);
      queryClient.invalidateQueries({
        queryKey: ["driver", "dashboard"],
      });
      queryClient.invalidateQueries({
        queryKey: ["driver", "offers"],
      });

      const isAvailable = response?.data?.isAvailable;

      toast.success(
        isAvailable
          ? "You are available for deliveries."
          : "You are unavailable for new deliveries.",
      );
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
