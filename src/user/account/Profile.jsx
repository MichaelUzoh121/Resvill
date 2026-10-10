// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";

// import ProfileForm from "../components/ProfileForm";
// import PasswordForm from "../components/PasswordForm";

// import { useUser } from "../../hooks/useUser";

//     function Profile() {
//   const {
//     profile,
//     updateProfile,
//     updatingProfile,
//     changePassword,
//     changingPassword,
//   } = useUser();

//   const [profileForm, setProfileForm] = useState(null);

//   const [passwordForm, setPasswordForm] = useState({
//     current: "",
//     next: "",
//     confirm: "",
//   });

//   useEffect(() => {
//     if (!profile) return;

//     setProfileForm({
//       fullName: `${profile.firstname || ""} ${profile.lastname || ""}`.trim(),

//       phone: profile.phone || "",

//       email: profile.email || "",

//       birthday: profile.birthday || "",

//       homeAddress: profile.addresses?.[0] || {},

//       deliveryAddress: profile.addresses?.[0] || {},
//     });
//   }, [profile]);

//   const updateField = (event) => {
//     const { name, value } = event.target;

//     setProfileForm((current) => ({
//       ...current,

//       [name]: value,
//     }));
//   };

//   const updateAddress = (field) => (location) => {
//     setProfileForm((current) => ({
//       ...current,

//       [field]: location,
//     }));
//   };

//   const saveProfile = async (event) => {
//     event.preventDefault();

//     await updateProfile({
//       firstname: profileForm.fullName.split(" ")[0],

//       lastname: profileForm.fullName.split(" ").slice(1).join(" "),

//       phone: profileForm.phone,

//       birthday: profileForm.birthday,

//       addresses: [profileForm.deliveryAddress],
//     });
//   };

//   const updatePassword = async (event) => {
//     event.preventDefault();

//     if (passwordForm.next.length < 6) {
//       toast.error("Password must be at least 6 characters");

//       return;
//     }

//     if (passwordForm.next !== passwordForm.confirm) {
//       toast.error("Passwords do not match");

//       return;
//     }

//     await changePassword({
//       currentPassword: passwordForm.current,

//       newPassword: passwordForm.next,
//     });

//     setPasswordForm({
//       current: "",
//       next: "",
//       confirm: "",
//     });
//   };

//   if (!profileForm) {
//     return (
//       <div
//         className="
//         rounded-2xl
//         border border-dark-200
//         bg-white
//         p-8
//         text-center
//         shadow-soft
//       "
//       >
//         <p className="text-dark-600">Loading profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <p
//           className="
//           text-sm
//           font-bold
//           uppercase
//           tracking-widest
//           text-primary-500
//         "
//         >
//           Profile
//         </p>

//         <h1
//           className="
//           mt-2
//           text-3xl
//           font-extrabold
//           text-dark-900
//         "
//         >
//           Personal Information
//         </h1>

//         <p className="mt-2 text-dark-600">
//           Manage your account details and security.
//         </p>
//       </div>

//       <div
//         className="
//         grid
//         gap-6
//         xl:grid-cols-2
//       "
//       >
//         <ProfileForm
//           profileForm={profileForm}
//           updateField={updateField}
//           updateAddress={updateAddress}
//           saveProfile={saveProfile}
//           loading={updatingProfile}
//         />

//         <PasswordForm
//           passwordForm={passwordForm}
//           setPasswordForm={setPasswordForm}
//           updatePassword={updatePassword}
//           loading={changingPassword}
//         />
//       </div>
//     </div>
//   );
// }

// export default Profile;



import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import ProfileForm from "../components/ProfileForm";
import PasswordForm from "../components/PasswordForm";

import { useUser } from "../../hooks/useUser";

function Profile() {
  const {
    profile,
    updateProfile,
    updatingProfile,
    changePassword,
    changingPassword,
  } = useUser();

  const [profileForm, setProfileForm] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  useEffect(() => {
    if (!profile) return;

    setProfileForm({
      firstname: profile.firstname || "",
      lastname: profile.lastname || "",
      phone: profile.phone || "",
      email: profile.email || "",
    });
  }, [profile]);

  const updateField = (event) => {
    const { name, value } = event.target;

    setProfileForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!profileForm.firstname.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!profileForm.lastname.trim()) {
      toast.error("Last name is required");
      return;
    }

    await updateProfile({
      firstname: profileForm.firstname.trim(),
      lastname: profileForm.lastname.trim(),
      phone: profileForm.phone.trim(),
    });
  };

  const updatePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.current) {
      toast.error("Please enter your current password");
      return;
    }

    if (passwordForm.next.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordForm.current === passwordForm.next) {
      toast.error("New password must be different from your current password");
      return;
    }

    await changePassword({
      currentPassword: passwordForm.current,
      newPassword: passwordForm.next,
      confirmPassword: passwordForm.confirm,
    });

    setPasswordForm({
      current: "",
      next: "",
      confirm: "",
    });
  };

  if (!profileForm) {
    return (
      <div
        className="
          rounded-2xl
          border border-dark-200
          bg-white
          p-8
          text-center
          shadow-soft
        "
      >
        <p className="text-dark-600">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p
          className="
            text-sm
            font-bold
            uppercase
            tracking-widest
            text-primary-500
          "
        >
          Profile
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-extrabold
            text-dark-900
          "
        >
          Personal Information
        </h1>

        <p className="mt-2 text-dark-600">
          Manage your account details and security.
        </p>
      </div>

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >
        <ProfileForm
          profileForm={profileForm}
          updateField={updateField}
          saveProfile={saveProfile}
          loading={updatingProfile}
        />

        <PasswordForm
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          updatePassword={updatePassword}
          loading={changingPassword}
        />
      </div>
    </div>
  );
}

export default Profile;