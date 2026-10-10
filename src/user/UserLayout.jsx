// import { Outlet } from "react-router-dom";

// import UserHeader from "./components/UserHeader";
// import UserSidebar from "./components/UserSidebar";

// import { useUser } from "../hooks/useUser";

// import Loader from "../common/Loader";
// import ErrorState from "../common/ErrorState";
// import Header from "../components/Header";

// function UserLayout() {
//   const { profile, isLoading, isError } = useUser();

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (isError) {
//     return <ErrorState message="Unable to load account information" />;
//   }

//   return (
//     <>
//       <main className="min-h-screen bg-dark-50 px-4 py-8 sm:px-6 lg:px-8">
//         <Header />

//         <div className="mx-auto max-w-7xl">
//           <UserHeader user={profile} />

//           <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
//             <UserSidebar />

//             <section className="min-w-0">
//               <Outlet
//                 context={{
//                   user: profile,
//                 }}
//               />
//             </section>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

// export default UserLayout;



import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import UserHeader from "./components/UserHeader";
import UserSidebar from "./components/UserSidebar";

import { useUser } from "../hooks/useUser";

import Loader from "../common/Loader";
import ErrorState from "../common/ErrorState";

function UserLayout() {
  const {
    profile,
    isLoading,
    isError,
  } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Header />
        <ErrorState message="Unable to load account information" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50">
      <Header />

      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          <UserHeader user={profile} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

            {/* ACCOUNT SIDEBAR */}
            <aside className="hidden lg:block">
              <UserSidebar />
            </aside>

            {/* ACCOUNT CONTENT */}
            <section className="min-w-0">
              <Outlet
                context={{
                  user: profile,
                }}
              />
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

export default UserLayout;