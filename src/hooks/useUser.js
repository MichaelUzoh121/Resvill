import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../services/userService";

import { toast } from "react-hot-toast";


export const useUser = () => {
  const queryClient = useQueryClient();


  const profileQuery = useQuery({
    queryKey: ["user-profile"],

    queryFn: getProfile,

    staleTime: 1000 * 60 * 5,
  });



  const updateProfileMutation = useMutation({

    mutationFn: updateProfile,


    onSuccess: (data) => {

      queryClient.invalidateQueries({
        queryKey: ["user-profile"],
      });


      toast.success(
        data?.message ||
        "Profile updated successfully"
      );

    },


    onError: (error) => {

      toast.error(
        error?.response?.data?.message ||
        "Unable to update profile"
      );

    },

  });



  const changePasswordMutation = useMutation({

    mutationFn: changePassword,


    onSuccess: (data) => {

      toast.success(
        data?.message ||
        "Password changed successfully"
      );

    },


    onError: (error) => {

      toast.error(
        error?.response?.data?.message ||
        "Unable to change password"
      );

    },

  });



  const deleteAccountMutation = useMutation({

    mutationFn: deleteAccount,


    onSuccess: (data) => {

      toast.success(
        data?.message ||
        "Account deleted successfully"
      );


      queryClient.clear();

    },


    onError: (error) => {

      toast.error(
        error?.response?.data?.message ||
        "Unable to delete account"
      );

    },

  });



  return {

    profile: profileQuery.data?.data,

    isLoading: profileQuery.isLoading,

    isError: profileQuery.isError,


    refetchProfile:
      profileQuery.refetch,


    updateProfile:
      updateProfileMutation.mutateAsync,


    updatingProfile:
      updateProfileMutation.isPending,


    changePassword:
      changePasswordMutation.mutateAsync,


    changingPassword:
      changePasswordMutation.isPending,


    deleteAccount:
      deleteAccountMutation.mutateAsync,


    deletingAccount:
      deleteAccountMutation.isPending,

  };
};