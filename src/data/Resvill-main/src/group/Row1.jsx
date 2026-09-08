import React from "react";
import { ArrowRight, Users, ShoppingBag, Utensils } from "lucide-react";

function Row1() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary-50 px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-white/80 blur-3xl" />

      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        {/* Content */}
        <div className="max-w-xl">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 text-xs font-bold text-primary-600 shadow-sm">
            <Users size={15} />
            Group Ordering
          </div>

          {/* Heading */}
          <h1 className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-dark-950 sm:text-5xl lg:text-6xl">
            Everyone orders.
            <span className="block text-primary-500">
              One group. One order.
            </span>
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-lg text-sm leading-7 text-dark-600 sm:text-base">
            Ordering food for your office, friends, family, or event? Create a
            group order and let everyone choose their own meal. We'll bring
            everything together in one simple order.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover"
            >
              Start a Group Order
              <ArrowRight size={17} />
            </button>

            <a href="#group-order-steps">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-5 py-3.5 text-sm font-bold text-dark-700 transition-colors hover:border-primary-300 hover:text-primary-500"
              >
                How It Works
              </button>
            </a>
          </div>

          {/* Small Stats */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-dark-500">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary-500 shadow-sm">
                <Users size={14} />
              </div>
              Everyone chooses their own food
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary-500 shadow-sm">
                <ShoppingBag size={14} />
              </div>
              One convenient order
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
          {/* Main Card */}
          <div className="relative rounded-3xl border border-white bg-white p-5 shadow-card sm:p-6">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-dark-100 pb-4">
              <div>
                <p className="text-xs font-medium text-dark-400">Group Order</p>

                <h3 className="mt-1 font-heading text-lg font-bold text-dark-950">
                  Friday Office Lunch
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <Utensils size={20} />
              </div>
            </div>

            {/* Members */}
            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-dark-400">
                  Participants
                </span>

                <span className="text-xs font-bold text-primary-500">
                  4 people
                </span>
              </div>

              <div className="mt-3 flex items-center">
                {[
                  {
                    name: "M",
                    color: "bg-primary-500",
                  },
                  {
                    name: "A",
                    color: "bg-dark-800",
                  },
                  {
                    name: "J",
                    color: "bg-primary-300",
                  },
                  {
                    name: "S",
                    color: "bg-dark-400",
                  },
                ].map((member, index) => (
                  <div
                    key={index}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white ${member.color} text-xs font-bold text-white ${
                      index !== 0 ? "-ml-2" : ""
                    }`}
                  >
                    {member.name}
                  </div>
                ))}

                <div className="ml-3 text-xs font-medium text-dark-500">
                  Everyone is ordering
                </div>
              </div>
            </div>

            {/* Food Items */}
            <div className="mt-5 space-y-3">
              {[
                {
                  name: "Chicken Burger",
                  person: "Michael",
                  price: "₦4,500",
                },
                {
                  name: "Jollof Rice & Chicken",
                  person: "Amaka",
                  price: "₦5,500",
                },
                {
                  name: "Chicken Shawarma",
                  person: "John",
                  price: "₦3,500",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl bg-dark-50 p-3"
                >
                  <div>
                    <p className="text-sm font-bold text-dark-800">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-dark-400">{item.person}</p>
                  </div>

                  <span className="text-sm font-bold text-dark-800">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-5 flex items-center justify-between border-t border-dark-100 pt-4">
              <span className="text-sm font-semibold text-dark-500">
                Group Total
              </span>

              <span className="font-heading text-xl font-extrabold text-dark-950">
                ₦13,500
              </span>
            </div>
          </div>

          {/* Floating Invite Card */}
          <div className="absolute -bottom-10 -left-5 hidden rounded-2xl border border-dark-100 bg-white p-3 shadow-card sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                <Users size={16} />
              </div>

              <div>
                <p className="text-xs font-bold text-dark-800">
                  Invite your friends
                </p>

                <p className="mt-0.5 text-[11px] text-dark-400">
                  Share your group link
                </p>
              </div>
            </div>
          </div>

          {/* Floating Status */}
          <div className="absolute -right-5 -top-5 hidden rounded-2xl border border-dark-100 bg-white px-4 py-3 shadow-card sm:block">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary-500" />

              <span className="text-xs font-bold text-dark-700">
                3 orders added
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row1;
