// import React, { useState } from "react";
// import {
//   LuUser,
//   LuMail,
//   LuPhone,
//   LuShieldCheck,
//   LuLogOut,
//   LuCircleUserRound,
//   LuPencil,
//   LuCheck,
//   LuX,
//   LuLoaderCircle,
//   LuLockKeyhole,
//   LuEye,
//   LuEyeOff,
// } from "react-icons/lu";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// import { useAuth } from "../../hooks/useAuth";
// import { ROLES } from "../../constants/roles";
// import {
//   useUpdateStaffProfile,
//   useChangeStaffPassword,
// } from "../hooks/useStaffAccount";

// const getFullName = (user) => {
//   const name = [user?.firstname, user?.lastname]
//     .filter(Boolean)
//     .join(" ")
//     .trim();

//   return name || "Staff Member";
// };

// const getInitials = (user) => {
//   const name = getFullName(user);

//   if (!name || name === "Staff Member") {
//     return "S";
//   }

//   return name
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part.charAt(0).toUpperCase())
//     .join("");
// };

// const getRoleLabel = (role) => {
//   if (role === ROLES.STAFF) {
//     return "Staff";
//   }

//   if (role === ROLES.ADMIN) {
//     return "Admin";
//   }

//   if (role === ROLES.DELIVERY) {
//     return "Delivery";
//   }

//   if (role === ROLES.CUSTOMER) {
//     return "Customer";
//   }

//   return role || "Staff";
// };

// function StaffAccount() {
//   const navigate = useNavigate();
//   const { user, logout, setUser } = useAuth();

//   const updateProfile = useUpdateStaffProfile();
//   const changePassword = useChangeStaffPassword();

//   const [editingProfile, setEditingProfile] = useState(false);

//   const [profileForm, setProfileForm] = useState({
//     firstname: user?.firstname || "",
//     lastname: user?.lastname || "",
//     phone: user?.phone || "",
//     password: "",
//   });

//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [showPasswords, setShowPasswords] = useState({
//     currentPassword: false,
//     newPassword: false,
//     confirmPassword: false,
//   });

//   const fullName = getFullName(user);
//   const initials = getInitials(user);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate("/auth/login", { replace: true });
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Failed to logout"
//       );
//     }
//   };

//   const handleEditProfile = () => {
//     setProfileForm({
//       firstname: user?.firstname || "",
//       lastname: user?.lastname || "",
//       phone: user?.phone || "",
//       password: "",
//     });

//     setEditingProfile(true);
//   };

//   const handleCancelProfileEdit = () => {
//     if (updateProfile.isPending) {
//       return;
//     }

//     setEditingProfile(false);
//   };

//   const handleProfileChange = (event) => {
//     const { name, value } = event.target;

//     setProfileForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   };

//   const handleProfileSubmit = async (event) => {
//     event.preventDefault();

//     if (!profileForm.firstname.trim()) {
//       toast.error("First name is required.");
//       return;
//     }

//     if (!profileForm.lastname.trim()) {
//       toast.error("Last name is required.");
//       return;
//     }

//     if (!profileForm.password.trim()) {
//       toast.error(
//         "Enter your current password to confirm this change."
//       );
//       return;
//     }

//     try {
//       const response = await updateProfile.mutateAsync({
//         firstname: profileForm.firstname.trim(),
//         lastname: profileForm.lastname.trim(),
//         phone: profileForm.phone.trim(),
//         password: profileForm.password,
//       });

//       const updatedUser =
//         response?.data?.user ||
//         response?.user ||
//         null;

//       if (updatedUser && typeof setUser === "function") {
//         setUser(updatedUser);
//       }

//       toast.success(
//         response?.message ||
//           "Profile updated successfully."
//       );

//       setEditingProfile(false);

//       setProfileForm((current) => ({
//         ...current,
//         password: "",
//       }));
//     } catch (error) {
//       const message =
//         error?.response?.data?.message ||
//         "Failed to update your profile.";

//       toast.error(message);
//     }
//   };

//   const handlePasswordChange = (event) => {
//     const { name, value } = event.target;

//     setPasswordForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   };

//   const togglePasswordVisibility = (field) => {
//     setShowPasswords((current) => ({
//       ...current,
//       [field]: !current[field],
//     }));
//   };

//   const handlePasswordSubmit = async (event) => {
//     event.preventDefault();

//     const currentPassword =
//       passwordForm.currentPassword.trim();

//     const newPassword =
//       passwordForm.newPassword;

//     const confirmPassword =
//       passwordForm.confirmPassword;

//     if (!currentPassword) {
//       toast.error("Enter your current password.");
//       return;
//     }

//     if (!newPassword) {
//       toast.error("Enter a new password.");
//       return;
//     }

//     if (newPassword.length < 8) {
//       toast.error(
//         "Your new password must be at least 8 characters."
//       );
//       return;
//     }

//     if (newPassword === currentPassword) {
//       toast.error(
//         "Your new password must be different from your current password."
//       );
//       return;
//     }

//     if (!confirmPassword) {
//       toast.error("Confirm your new password.");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast.error("The new passwords do not match.");
//       return;
//     }

//     try {
//       const response = await changePassword.mutateAsync({
//         currentPassword,
//         newPassword,
//       });

//       toast.success(
//         response?.message ||
//           "Password changed successfully."
//       );

//       setPasswordForm({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (error) {
//       const message =
//         error?.response?.data?.message ||
//         "Failed to change your password.";

//       toast.error(message);
//     }
//   };

//   const renderPasswordToggle = (field) => (
//     <button
//       type="button"
//       onClick={() => togglePasswordVisibility(field)}
//       disabled={changePassword.isPending}
//       className="absolute inset-y-0 right-0 flex items-center px-4 text-dark-400 transition hover:text-dark-700 disabled:cursor-not-allowed disabled:opacity-60"
//       aria-label={
//         showPasswords[field]
//           ? "Hide password"
//           : "Show password"
//       }
//     >
//       {showPasswords[field] ? (
//         <LuEyeOff className="h-4 w-4" />
//       ) : (
//         <LuEye className="h-4 w-4" />
//       )}
//     </button>
//   );

//   return (
//     <section className="space-y-6">
//       {/* Header */}
//       <div>
//         <div className="flex items-center gap-3">
//           <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
//             <LuUser className="h-5 w-5" />
//           </div>

//           <div>
//             <h1 className="text-2xl font-bold text-dark-900">
//               Account
//             </h1>

//             <p className="mt-1 text-sm text-dark-500">
//               Manage your Staff account information.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Profile */}
//       <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-sm">
//         <div className="flex flex-col gap-4 border-b border-dark-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
//           <div>
//             <h2 className="text-lg font-semibold text-dark-900">
//               Profile
//             </h2>

//             <p className="mt-1 text-sm text-dark-500">
//               Your authenticated account details.
//             </p>
//           </div>

//           {!editingProfile && (
//             <button
//               type="button"
//               onClick={handleEditProfile}
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
//             >
//               <LuPencil className="h-4 w-4" />
//               Edit Profile
//             </button>
//           )}
//         </div>

//         <div className="p-5 sm:p-6">
//           {!editingProfile ? (
//             <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
//               {/* Avatar */}
//               <div className="shrink-0">
//                 {user?.avatar || user?.profileImage ? (
//                   <img
//                     src={user.avatar || user.profileImage}
//                     alt={fullName}
//                     className="h-24 w-24 rounded-2xl object-cover ring-4 ring-primary-50"
//                   />
//                 ) : (
//                   <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-primary-50 text-2xl font-bold text-primary-600 ring-4 ring-primary-50">
//                     {initials}
//                   </div>
//                 )}
//               </div>

//               {/* Name */}
//               <div className="min-w-0">
//                 <h3 className="text-xl font-bold text-dark-900">
//                   {fullName}
//                 </h3>

//                 <p className="mt-1 text-sm text-dark-500">
//                   {user?.email || "No email available"}
//                 </p>

//                 <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-600">
//                   <LuShieldCheck className="h-3.5 w-3.5" />
//                   {getRoleLabel(user?.role)}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <form
//               onSubmit={handleProfileSubmit}
//               className="space-y-5"
//             >
//               <div className="grid gap-5 sm:grid-cols-2">
//                 {/* First Name */}
//                 <div>
//                   <label
//                     htmlFor="firstname"
//                     className="mb-2 block text-sm font-medium text-dark-700"
//                   >
//                     First Name
//                   </label>

//                   <input
//                     id="firstname"
//                     name="firstname"
//                     type="text"
//                     value={profileForm.firstname}
//                     onChange={handleProfileChange}
//                     disabled={updateProfile.isPending}
//                     className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
//                     placeholder="Enter your first name"
//                   />
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <label
//                     htmlFor="lastName"
//                     className="mb-2 block text-sm font-medium text-dark-700"
//                   >
//                     Last Name
//                   </label>

//                   <input
//                     id="lastname"
//                     name="lastname"
//                     type="text"
//                     value={profileForm.lastname}
//                     onChange={handleProfileChange}
//                     disabled={updateProfile.isPending}
//                     className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
//                     placeholder="Enter your last name"
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div>
//                   <label
//                     htmlFor="phone"
//                     className="mb-2 block text-sm font-medium text-dark-700"
//                   >
//                     Phone Number
//                   </label>

//                   <input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     value={profileForm.phone}
//                     onChange={handleProfileChange}
//                     disabled={updateProfile.isPending}
//                     className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
//                     placeholder="Enter your phone number"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="mb-2 block text-sm font-medium text-dark-700"
//                   >
//                     Email Address
//                   </label>

//                   <input
//                     id="email"
//                     type="email"
//                     value={user?.email || ""}
//                     disabled
//                     className="w-full cursor-not-allowed rounded-xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm text-dark-500 outline-none"
//                   />

//                   <p className="mt-1.5 text-xs text-dark-400">
//                     Email address cannot be changed here.
//                   </p>
//                 </div>
//               </div>

//               {/* Password Confirmation */}
//               <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
//                 <div className="flex items-start gap-3">
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600">
//                     <LuLockKeyhole className="h-4 w-4" />
//                   </div>

//                   <div className="min-w-0 flex-1">
//                     <h3 className="text-sm font-semibold text-dark-900">
//                       Confirm your changes
//                     </h3>

//                     <p className="mt-1 text-xs leading-5 text-dark-500">
//                       Enter your current password to securely confirm
//                       your profile changes.
//                     </p>

//                     <input
//                       id="profilePassword"
//                       name="password"
//                       type="password"
//                       value={profileForm.password}
//                       onChange={handleProfileChange}
//                       disabled={updateProfile.isPending}
//                       className="mt-3 w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
//                       placeholder="Enter your current password"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//                 <button
//                   type="button"
//                   onClick={handleCancelProfileEdit}
//                   disabled={updateProfile.isPending}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   <LuX className="h-4 w-4" />
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={updateProfile.isPending}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   {updateProfile.isPending ? (
//                     <>
//                       <LuLoaderCircle className="h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <LuCheck className="h-4 w-4" />
//                       Save Changes
//                     </>
//                   )}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>

//       {/* Account Information */}
//       <div className="rounded-2xl border border-dark-100 bg-white shadow-sm">
//         <div className="border-b border-dark-100 px-5 py-5 sm:px-6">
//           <h2 className="text-lg font-semibold text-dark-900">
//             Account Information
//           </h2>

//           <p className="mt-1 text-sm text-dark-500">
//             Information associated with your Staff account.
//           </p>
//         </div>

//         <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
//           {/* Name */}
//           <div className="rounded-xl bg-dark-50 p-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-dark-500">
//                 <LuUser className="h-4 w-4" />
//               </div>

//               <div className="min-w-0">
//                 <p className="text-xs font-medium text-dark-400">
//                   Full Name
//                 </p>

//                 <p className="mt-1 truncate text-sm font-semibold text-dark-800">
//                   {fullName}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Email */}
//           <div className="rounded-xl bg-dark-50 p-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-dark-500">
//                 <LuMail className="h-4 w-4" />
//               </div>

//               <div className="min-w-0">
//                 <p className="text-xs font-medium text-dark-400">
//                   Email Address
//                 </p>

//                 <p className="mt-1 truncate text-sm font-semibold text-dark-800">
//                   {user?.email || "Not available"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Phone */}
//           <div className="rounded-xl bg-dark-50 p-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-dark-500">
//                 <LuPhone className="h-4 w-4" />
//               </div>

//               <div className="min-w-0">
//                 <p className="text-xs font-medium text-dark-400">
//                   Phone Number
//                 </p>

//                 <p className="mt-1 truncate text-sm font-semibold text-dark-800">
//                   {user?.phone || "Not available"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Role */}
//           <div className="rounded-xl bg-dark-50 p-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-dark-500">
//                 <LuCircleUserRound className="h-4 w-4" />
//               </div>

//               <div className="min-w-0">
//                 <p className="text-xs font-medium text-dark-400">
//                   Account Role
//                 </p>

//                 <p className="mt-1 text-sm font-semibold text-dark-800">
//                   {getRoleLabel(user?.role)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Change Password */}
//       <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-sm">
//         <div className="border-b border-dark-100 px-5 py-5 sm:px-6">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
//               <LuLockKeyhole className="h-5 w-5" />
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold text-dark-900">
//                 Change Password
//               </h2>

//               <p className="mt-1 text-sm text-dark-500">
//                 Update your Staff account password securely.
//               </p>
//             </div>
//           </div>
//         </div>

//         <form
//           onSubmit={handlePasswordSubmit}
//           className="space-y-5 p-5 sm:p-6"
//         >
//           <div className="grid gap-5">
//             {/* Current Password */}
//             <div>
//               <label
//                 htmlFor="currentPassword"
//                 className="mb-2 block text-sm font-medium text-dark-700"
//               >
//                 Current Password
//               </label>

//               <div className="relative">
//                 <input
//                   id="currentPassword"
//                   name="currentPassword"
//                   type={
//                     showPasswords.currentPassword
//                       ? "text"
//                       : "password"
//                   }
//                   value={passwordForm.currentPassword}
//                   onChange={handlePasswordChange}
//                   disabled={changePassword.isPending}
//                   autoComplete="current-password"
//                   className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 pr-12 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
//                   placeholder="Enter your current password"
//                 />

//                 {renderPasswordToggle("currentPassword")}
//               </div>
//             </div>

//             <div className="grid gap-5 sm:grid-cols-2">
//               {/* New Password */}
//               <div>
//                 <label
//                   htmlFor="newPassword"
//                   className="mb-2 block text-sm font-medium text-dark-700"
//                 >
//                   New Password
//                 </label>

//                 <div className="relative">
//                   <input
//                     id="newPassword"
//                     name="newPassword"
//                     type={
//                       showPasswords.newPassword
//                         ? "text"
//                         : "password"
//                     }
//                     value={passwordForm.newPassword}
//                     onChange={handlePasswordChange}
//                     disabled={changePassword.isPending}
//                     autoComplete="new-password"
//                     className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 pr-12 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
//                     placeholder="Enter a new password"
//                   />

//                   {renderPasswordToggle("newPassword")}
//                 </div>

//                 <p className="mt-1.5 text-xs text-dark-400">
//                   Must be at least 8 characters.
//                 </p>
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label
//                   htmlFor="confirmPassword"
//                   className="mb-2 block text-sm font-medium text-dark-700"
//                 >
//                   Confirm New Password
//                 </label>

//                 <div className="relative">
//                   <input
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type={
//                       showPasswords.confirmPassword
//                         ? "text"
//                         : "password"
//                     }
//                     value={passwordForm.confirmPassword}
//                     onChange={handlePasswordChange}
//                     disabled={changePassword.isPending}
//                     autoComplete="new-password"
//                     className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 pr-12 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 disabled:cursor-not-allowed disabled:bg-dark-50"
//                     placeholder="Confirm your new password"
//                   />

//                   {renderPasswordToggle("confirmPassword")}
//                 </div>
//               </div>
//             </div>

//             {/* Security Notice */}
//             <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-4">
//               <div className="flex items-start gap-3">
//                 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600">
//                   <LuShieldCheck className="h-4 w-4" />
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-semibold text-dark-900">
//                     Keep your account secure
//                   </h3>

//                   <p className="mt-1 text-xs leading-5 text-dark-500">
//                     Use a password that is difficult to guess and avoid
//                     reusing passwords from other accounts.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={changePassword.isPending}
//                 className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
//               >
//                 {changePassword.isPending ? (
//                   <>
//                     <LuLoaderCircle className="h-4 w-4 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     <LuLockKeyhole className="h-4 w-4" />
//                     Change Password
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Verification */}
//       <div className="rounded-2xl border border-dark-100 bg-white p-5 shadow-sm sm:p-6">
//         <div className="flex items-start gap-3">
//           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
//             <LuShieldCheck className="h-5 w-5" />
//           </div>

//           <div>
//             <h2 className="font-semibold text-dark-900">
//               Account Verification
//             </h2>

//             <p className="mt-1 text-sm text-dark-500">
//               {user?.isVerified
//                 ? "Your account is verified."
//                 : "Your account is not currently marked as verified."}
//             </p>

//             <div className="mt-3">
//               <span
//                 className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
//                   user?.isVerified
//                     ? "bg-green-50 text-green-600"
//                     : "bg-yellow-50 text-yellow-600"
//                 }`}
//               >
//                 {user?.isVerified
//                   ? "Verified"
//                   : "Not Verified"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Logout */}
//       <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h2 className="font-semibold text-dark-900">
//               Sign Out
//             </h2>

//             <p className="mt-1 text-sm text-dark-500">
//               Sign out of your Staff account on this device.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={handleLogout}
//             className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
//           >
//             <LuLogOut className="h-4 w-4" />
//             Logout
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default StaffAccount;


import React, { useState } from "react";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuShieldCheck,
  LuLogOut,
  LuCircleUserRound,
  LuPencil,
  LuCheck,
  LuX,
  LuLoaderCircle,
  LuLockKeyhole,
  LuEye,
  LuEyeOff,
  LuChevronRight,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";
import {
  useUpdateStaffProfile,
  useChangeStaffPassword,
} from "../hooks/useStaffAccount";

const getFullName = (user) => {
  const name = [user?.firstname, user?.lastname]
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "Staff Member";
};

const getInitials = (user) => {
  const name = getFullName(user);

  if (!name || name === "Staff Member") {
    return "S";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const getRoleLabel = (role) => {
  if (role === ROLES.STAFF) return "Staff";
  if (role === ROLES.ADMIN) return "Admin";
  if (role === ROLES.DELIVERY) return "Delivery";
  if (role === ROLES.CUSTOMER) return "Customer";

  return role || "Staff";
};

function StaffAccount() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();

  const updateProfile = useUpdateStaffProfile();
  const changePassword = useChangeStaffPassword();

  const [editingProfile, setEditingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    phone: user?.phone || "",
    password: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const fullName = getFullName(user);
  const initials = getInitials(user);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to logout"
      );
    }
  };

  const handleEditProfile = () => {
    setProfileForm({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      phone: user?.phone || "",
      password: "",
    });

    setEditingProfile(true);
  };

  const handleCancelProfileEdit = () => {
    if (updateProfile.isPending) return;

    setEditingProfile(false);
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    if (!profileForm.firstname.trim()) {
      toast.error("First name is required.");
      return;
    }

    if (!profileForm.lastname.trim()) {
      toast.error("Last name is required.");
      return;
    }

    if (!profileForm.password.trim()) {
      toast.error(
        "Enter your current password to confirm this change."
      );
      return;
    }

    try {
      const response = await updateProfile.mutateAsync({
        firstname: profileForm.firstname.trim(),
        lastname: profileForm.lastname.trim(),
        phone: profileForm.phone.trim(),
        password: profileForm.password,
      });

      const updatedUser =
        response?.data?.user ||
        response?.user ||
        null;

      if (updatedUser && typeof setUser === "function") {
        setUser(updatedUser);
      }

      toast.success(
        response?.message ||
          "Profile updated successfully."
      );

      setEditingProfile(false);

      setProfileForm((current) => ({
        ...current,
        password: "",
      }));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update your profile."
      );
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const currentPassword =
      passwordForm.currentPassword.trim();

    const newPassword = passwordForm.newPassword;
    const confirmPassword = passwordForm.confirmPassword;

    if (!currentPassword) {
      toast.error("Enter your current password.");
      return;
    }

    if (!newPassword) {
      toast.error("Enter a new password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "Your new password must be at least 8 characters."
      );
      return;
    }

    if (newPassword === currentPassword) {
      toast.error(
        "Your new password must be different from your current password."
      );
      return;
    }

    if (!confirmPassword) {
      toast.error("Confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("The new passwords do not match.");
      return;
    }

    try {
      const response = await changePassword.mutateAsync({
        currentPassword,
        newPassword,
      });

      toast.success(
        response?.message ||
          "Password changed successfully."
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change your password."
      );
    }
  };

  const renderPasswordToggle = (field) => (
    <button
      type="button"
      onClick={() => togglePasswordVisibility(field)}
      disabled={changePassword.isPending}
      className="absolute inset-y-0 right-0 flex items-center px-4 text-dark-400 transition hover:text-dark-700 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={
        showPasswords[field]
          ? "Hide password"
          : "Show password"
      }
    >
      {showPasswords[field] ? (
        <LuEyeOff className="h-4 w-4" />
      ) : (
        <LuEye className="h-4 w-4" />
      )}
    </button>
  );

  const inputClass =
    "w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-900 outline-none transition placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 disabled:cursor-not-allowed disabled:bg-dark-50";

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
          Staff Workspace
        </p>

        <h1 className="font-heading text-2xl font-bold tracking-tight text-dark-900 sm:text-3xl">
          Account Settings
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-dark-500">
          Manage your profile, security credentials, and account
          information from one place.
        </p>
      </div>

      {/* Profile Hero */}
      <div className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-soft">
        <div className="relative overflow-hidden bg-dark-900 px-5 py-6 sm:px-7 sm:py-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-primary-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              {user?.avatar || user?.profileImage ? (
                <img
                  src={user.avatar || user.profileImage}
                  alt={fullName}
                  className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-4 ring-white/10 sm:h-24 sm:w-24"
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-500 text-2xl font-bold text-white ring-4 ring-white/10 sm:h-24 sm:w-24 sm:text-3xl">
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading truncate text-xl font-bold text-white sm:text-2xl">
                    {fullName}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    <LuShieldCheck className="h-3.5 w-3.5 text-primary-300" />
                    {getRoleLabel(user?.role)}
                  </span>
                </div>

                <p className="mt-1 truncate text-sm text-white/60">
                  {user?.email || "No email available"}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/50">
                  <span className="inline-flex items-center gap-1.5">
                    <LuPhone className="h-3.5 w-3.5" />
                    {user?.phone || "No phone number"}
                  </span>

                  <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />

                  <span className="inline-flex items-center gap-1.5">
                    <LuShieldCheck className="h-3.5 w-3.5" />
                    {user?.isVerified
                      ? "Verified account"
                      : "Verification pending"}
                  </span>
                </div>
              </div>
            </div>

            {!editingProfile && (
              <button
                type="button"
                onClick={handleEditProfile}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-dark-900 transition hover:bg-dark-50"
              >
                <LuPencil className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-5 sm:p-7">
          {!editingProfile ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-dark-100 bg-dark-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-dark-500 shadow-sm">
                    <LuUser className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                      Full Name
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-dark-800">
                      {fullName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-dark-100 bg-dark-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-dark-500 shadow-sm">
                    <LuMail className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                      Email
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-dark-800">
                      {user?.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-dark-100 bg-dark-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-dark-500 shadow-sm">
                    <LuPhone className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                      Phone
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-dark-800">
                      {user?.phone || "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleProfileSubmit}
              className="space-y-6"
            >
              <div className="flex items-center justify-between border-b border-dark-100 pb-4">
                <div>
                  <h3 className="font-heading text-base font-bold text-dark-900">
                    Edit Profile
                  </h3>

                  <p className="mt-1 text-xs text-dark-500">
                    Update the information associated with your
                    staff account.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancelProfileEdit}
                  disabled={updateProfile.isPending}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-dark-400 transition hover:bg-dark-50 hover:text-dark-700 disabled:opacity-50"
                  aria-label="Close profile editing"
                >
                  <LuX className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstname"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    First Name
                  </label>

                  <input
                    id="firstname"
                    name="firstname"
                    type="text"
                    value={profileForm.firstname}
                    onChange={handleProfileChange}
                    disabled={updateProfile.isPending}
                    autoComplete="given-name"
                    className={inputClass}
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastname"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    value={profileForm.lastname}
                    onChange={handleProfileChange}
                    disabled={updateProfile.isPending}
                    autoComplete="family-name"
                    className={inputClass}
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    disabled={updateProfile.isPending}
                    autoComplete="tel"
                    className={inputClass}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-dark-200 bg-dark-50 px-4 py-3 text-sm text-dark-500 outline-none"
                  />

                  <p className="mt-1.5 text-xs text-dark-400">
                    Email cannot be changed from this page.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4 sm:p-5">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                    <LuLockKeyhole className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-dark-900">
                      Confirm your identity
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-dark-500">
                      Enter your current password to authorize
                      changes to your profile.
                    </p>

                    <input
                      id="profilePassword"
                      name="password"
                      type="password"
                      value={profileForm.password}
                      onChange={handleProfileChange}
                      disabled={updateProfile.isPending}
                      autoComplete="current-password"
                      className={`${inputClass} mt-4`}
                      placeholder="Enter your current password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancelProfileEdit}
                  disabled={updateProfile.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-5 py-2.5 text-sm font-semibold text-dark-700 transition hover:bg-dark-50 disabled:opacity-60"
                >
                  <LuX className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateProfile.isPending ? (
                    <>
                      <LuLoaderCircle className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <LuCheck className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        {/* Security */}
        <div className="overflow-hidden rounded-3xl border border-dark-100 bg-white shadow-soft">
          <div className="border-b border-dark-100 px-5 py-5 sm:px-7">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <LuLockKeyhole className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold text-dark-900">
                  Password & Security
                </h2>

                <p className="mt-1 text-sm text-dark-500">
                  Keep your Staff account protected with a
                  strong password.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handlePasswordSubmit}
            className="p-5 sm:p-7"
          >
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-semibold text-dark-700"
                >
                  Current Password
                </label>

                <div className="relative">
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type={
                      showPasswords.currentPassword
                        ? "text"
                        : "password"
                    }
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={changePassword.isPending}
                    autoComplete="current-password"
                    className={`${inputClass} pr-12`}
                    placeholder="Enter your current password"
                  />

                  {renderPasswordToggle("currentPassword")}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={
                        showPasswords.newPassword
                          ? "text"
                          : "password"
                      }
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      disabled={changePassword.isPending}
                      autoComplete="new-password"
                      className={`${inputClass} pr-12`}
                      placeholder="Enter a new password"
                    />

                    {renderPasswordToggle("newPassword")}
                  </div>

                  <p className="mt-1.5 text-xs text-dark-400">
                    Must be at least 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-dark-700"
                  >
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showPasswords.confirmPassword
                          ? "text"
                          : "password"
                      }
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      disabled={changePassword.isPending}
                      autoComplete="new-password"
                      className={`${inputClass} pr-12`}
                      placeholder="Confirm your new password"
                    />

                    {renderPasswordToggle(
                      "confirmPassword"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-dark-100 bg-dark-50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                  <LuShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-dark-800">
                    Security recommendation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-dark-500">
                    Use a unique password that you do not reuse
                    across other accounts.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={changePassword.isPending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {changePassword.isPending ? (
                    <>
                      <LuLoaderCircle className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <LuLockKeyhole className="h-4 w-4" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Account Information */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-dark-400">
                Account
              </p>

              <h2 className="mt-1 font-heading text-lg font-bold text-dark-900">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Details associated with your Staff account.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-2xl bg-dark-50 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-dark-500 shadow-sm">
                  <LuUser className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                    Full Name
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-dark-800">
                    {fullName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-dark-50 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-dark-500 shadow-sm">
                  <LuMail className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                    Email
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-dark-800">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-dark-50 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-dark-500 shadow-sm">
                  <LuPhone className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                    Phone
                  </p>

                  <p className="mt-0.5 truncate text-sm font-semibold text-dark-800">
                    {user?.phone || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-dark-50 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-dark-500 shadow-sm">
                  <LuCircleUserRound className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-dark-400">
                    Role
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-dark-800">
                    {getRoleLabel(user?.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div
            className={`rounded-3xl border p-5 shadow-soft sm:p-6 ${
              user?.isVerified
                ? "border-green-100 bg-green-50/40"
                : "border-yellow-100 bg-yellow-50/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${
                  user?.isVerified
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                <LuShieldCheck className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-base font-bold text-dark-900">
                    Account Verification
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      user?.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user?.isVerified
                      ? "Verified"
                      : "Pending"}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-dark-500">
                  {user?.isVerified
                    ? "Your account is verified and ready for Staff operations."
                    : "Your account is not currently marked as verified."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-soft">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <LuLogOut className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-heading text-base font-bold text-dark-900">
                Sign Out
              </h2>

              <p className="mt-1 max-w-xl text-sm text-dark-500">
                Sign out of your Staff account on this device.
                You can sign back in whenever you need access.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LuLogOut className="h-4 w-4" />
            Sign Out
            <LuChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default StaffAccount;