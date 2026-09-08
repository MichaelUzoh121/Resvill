import React from "react";
import { Link } from "react-router-dom";
import {
  Utensils,
  ShoppingBag,
  MapPinned,
  Heart,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    id: 1,
    number: "01",
    icon: Utensils,
    title: "Choose Your Food",
    description:
      "Browse our menu and discover delicious meals made just the way you like them.",
  },
  {
    id: 2,
    number: "02",
    icon: ShoppingBag,
    title: "Place Your Order",
    description:
      "Customize your meal, add it to your cart, and complete your order in a few simple steps.",
  },
  {
    id: 3,
    number: "03",
    icon: MapPinned,
    title: "Track Your Order",
    description:
      "Follow your order every step of the way, from the kitchen to your doorstep.",
  },
  {
    id: 4,
    number: "04",
    icon: Heart,
    title: "Enjoy Your Meal",
    description:
      "Sit back, relax, and enjoy your fresh meal delivered right to you.",
  },
];

function Row6() {
  return (
    <section className="bg-dark-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
            Simple & easy
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-dark-900 sm:text-4xl lg:text-5xl">
            How it <span className="text-primary-500">works</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-dark-600 sm:text-base">
            Getting your favorite meal has never been easier. Just follow
            these four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Connecting Line */}
          <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden border-t border-dashed border-dark-300 lg:block" />

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="group relative z-10 flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="relative mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-soft transition-all duration-300 group-hover:bg-primary-500 group-hover:shadow-hover">
                  <Icon
                    size={25}
                    strokeWidth={1.8}
                    className="text-primary-500 transition-colors duration-300 group-hover:text-white"
                  />

                  {/* Step Number */}
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-[9px] font-bold text-white">
                    {step.id}
                  </span>
                </div>

                {/* Number */}
                <span className="mb-2 text-xs font-bold tracking-[0.15em] text-primary-500">
                  STEP {step.number}
                </span>

                {/* Title */}
                <h3 className="font-heading text-lg font-bold text-dark-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 max-w-xs text-sm leading-6 text-dark-600">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:bg-primary-600 hover:shadow-md"
          >
            Explore the Menu

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Row6;

