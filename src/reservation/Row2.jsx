import React, { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  Users,
  User,
  PartyPopper,
} from "lucide-react";

function Row2() {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    guests: 2,
    phone: "",
    email: "",
    time: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Reservation:", formData);
  };

  return (
    <section className="bg-dark-50 px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">
            Plan Your Order
          </span>

          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-dark-950 sm:text-4xl">
            Reserve your food in advance
          </h2>

          <p className="mt-4 text-sm leading-6 text-dark-500 sm:text-base sm:leading-7">
            Have an event, celebration, meeting, or special occasion
            coming up? Tell us when you need your food and we'll help
            you plan ahead.
          </p>
        </div>

        {/* Form Area */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-8 lg:grid-cols-[1fr_340px]">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-7 lg:p-8"
          >
            <div className="mb-7 flex items-center gap-3 border-b border-dark-100 pb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50">
                <PartyPopper
                  size={20}
                  className="text-primary-500"
                />
              </div>

              <div>
                <h3 className="font-heading text-base font-bold text-dark-950">
                  Tell us about your plans
                </h3>

                <p className="mt-1 text-xs text-dark-400">
                  We'll use these details to prepare your reservation.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="reservation-name"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="reservation-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="reservation-phone"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="reservation-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0800 000 0000"
                    required
                    className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="reservation-email"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="reservation-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label
                  htmlFor="reservation-guests"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Number of People
                </label>

                <div className="relative">
                  <Users
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <select
                    id="reservation-guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    className="h-12 w-full appearance-none rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm font-medium text-dark-800 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  >
                    {Array.from({ length: 50 }, (_, index) => {
                      const guests = index + 1;

                      return (
                        <option key={guests} value={guests}>
                          {guests} {guests === 1 ? "Person" : "People"}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="reservation-date"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Event Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="reservation-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm font-medium text-dark-800 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label
                  htmlFor="reservation-time"
                  className="mb-2 block text-sm font-semibold text-dark-800"
                >
                  Preferred Time
                </label>

                <div className="relative">
                  <Clock3
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
                  />

                  <input
                    id="reservation-time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="h-12 w-full rounded-xl border border-dark-200 bg-dark-50 pl-11 pr-4 text-sm font-medium text-dark-800 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-7 h-12 w-full rounded-xl bg-primary-500 px-5 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover"
            >
              Reserve Food for My Event
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-dark-400">
              Submit your plans and we'll confirm the details with
              you.
            </p>
          </form>

          {/* Information */}
          <aside className="relative overflow-hidden rounded-3xl bg-dark-950 p-6 text-white sm:p-7">
            {/* Decoration */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary-500/15 blur-2xl" />

            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500">
                <CalendarDays size={20} />
              </div>

              <h3 className="mt-6 font-heading text-xl font-bold">
                Planning something special?
              </h3>

              <p className="mt-3 text-sm leading-6 text-dark-300">
                Give us the details ahead of time and plan your food
                around the occasion. Whether it's a small gathering
                or a larger event, you can get your order organized
                before the day arrives.
              </p>

              <div className="mt-7 space-y-5 border-t border-white/10 pt-6">
                <div className="flex gap-3">
                  <CalendarDays
                    size={17}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Plan ahead
                    </p>

                    <p className="mt-1 text-xs leading-5 text-dark-400">
                      Let us know when your food will be needed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Users
                    size={17}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Feed your people
                    </p>

                    <p className="mt-1 text-xs leading-5 text-dark-400">
                      Perfect for groups, gatherings and events.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock3
                    size={17}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      Choose your timing
                    </p>

                    <p className="mt-1 text-xs leading-5 text-dark-400">
                      Tell us when you'd like your food to be ready.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Row2;

