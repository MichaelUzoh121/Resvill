// import {
//   MapPin,
//   CreditCard,
//   Package,
//   Heart,
//   Star,
// } from "lucide-react";

// import AccountStatCard from "../components/AccountStatCard";

// function AccountDashboard() {

//   return (
//     <div className="space-y-6">

//       <div>
//         <p className="text-sm font-bold uppercase tracking-widest text-primary-500">
//           Dashboard
//         </p>

//         <h1 className="mt-2 text-3xl font-extrabold text-dark-900">
//           Welcome back
//         </h1>

//         <p className="mt-2 text-dark-600">
//           Manage your Resvill account and track your activity.
//         </p>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-3">

//         <AccountStatCard
//           label="Total orders"
//           value="0"
//           icon={Package}
//         />

//         <AccountStatCard
//           label="Favorites"
//           value="0"
//           icon={Heart}
//         />

//         <AccountStatCard
//           label="Reward points"
//           value="0"
//           icon={Star}
//         />

//       </div>

//       <div className="grid gap-4 sm:grid-cols-2">

//         <DashboardCard
//           icon={MapPin}
//           title="Delivery address"
//           description="Manage your saved delivery locations."
//           link="/account/addresses"
//         />

//         <DashboardCard
//           icon={CreditCard}
//           title="Payment methods"
//           description="Manage your preferred payment options."
//           link="/account/payments"
//         />

//       </div>

//     </div>
//   );
// }

// function DashboardCard({
//  icon:Icon,
//  title,
//  description,
//  link
// }) {

//  return (
//    <a
//     href={link}
//     className="rounded-2xl border border-dark-200 bg-white p-5 shadow-soft"
//    >

//     <div className="flex gap-3">

//       <div className="
//         flex h-10 w-10
//         items-center justify-center
//         rounded-xl
//         bg-primary-50
//         text-primary-500
//       ">
//         <Icon size={20}/>
//       </div>

//       <div>

//         <h3 className="font-bold text-dark-900">
//           {title}
//         </h3>

//         <p className="mt-1 text-sm text-dark-600">
//           {description}
//         </p>

//       </div>

//     </div>

//    </a>
//  )

// }

// export default AccountDashboard;

import { MapPin, CreditCard, Package, Heart, Star } from "lucide-react";

import AccountStatCard from "../components/AccountStatCard";
import AccountCard from "../components/AccountCard";

import { useUser } from "../../hooks/useUser";
import { useOrders } from "../../hooks/useOrders";

function AccountDashboard() {
  //   const { profile, isLoading } = useUser();

  const { profile, isLoading } = useUser();
  const { pagination: orderPagination } = useOrders({
    page: 1,
    limit: 1,
  });

  if (isLoading) {
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
        <p className="text-dark-600">Loading dashboard...</p>
      </div>
    );
  }

  //   const totalOrders = profile?.orders?.length || 0;

  const totalOrders = Number(orderPagination?.total) || 0;

  const favorites = profile?.favorites?.length || 0;

  const rewardPoints = profile?.loyaltyPoints || 0;

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
          Dashboard
        </p>

        <h1
          className="
          mt-2
          text-3xl
          font-extrabold
          text-dark-900
        "
        >
          Welcome back
          {profile?.firstname ? `, ${profile.firstname}` : ""}
        </h1>

        <p className="mt-2 text-dark-600">
          Manage your Resvill account and track your activity.
        </p>
      </div>

      <div
        className="
        grid
        gap-4
        sm:grid-cols-3
      "
      >
        <AccountStatCard
          label="Total orders"
          value={totalOrders}
          icon={Package}
        />

        <AccountStatCard label="Favorites" value={favorites} icon={Heart} />

        <AccountStatCard
          label="Reward points"
          value={rewardPoints}
          icon={Star}
        />
      </div>

      <div
        className="
        grid
        gap-4
        sm:grid-cols-2
      "
      >
        <AccountCard
          icon={MapPin}
          title="Delivery address"
          detail={
            profile?.addresses?.[0]?.addressText ||
            "Manage your saved delivery locations."
          }
          action="Manage addresses"
          link="/account/addresses"
        />

        {/* <AccountCard
          icon={CreditCard}
          title="Payment methods"
          detail="Payment is handled securely during checkout."
          action="View payment settings"
          link="/account/payments"
        /> */}
      </div>
    </div>
  );
}

export default AccountDashboard;
