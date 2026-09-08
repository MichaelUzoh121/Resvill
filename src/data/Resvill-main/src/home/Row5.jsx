import React from "react";
import {
  Sparkles,
  Bike,
  ShieldCheck,
  MapPinned,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: Sparkles,
    title: "Fresh Meals",
    description:
      "Every meal is prepared fresh with quality ingredients and plenty of flavor.",
  },
  {
    id: 2,
    icon: Bike,
    title: "Fast Delivery",
    description:
      "Get your favorite meals delivered quickly, hot and ready to enjoy.",
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Secure Payment",
    description:
      "Your payments are protected with a secure and seamless checkout experience.",
  },
  {
    id: 4,
    icon: MapPinned,
    title: "Easy Tracking",
    description:
      "Stay updated from the moment your order is confirmed until it reaches you.",
  },
];

function Row5() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
            Why choose us
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-dark-900 sm:text-4xl lg:text-5xl">
            Why <span className="text-primary-500">Resvill?</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-dark-600 sm:text-base">
            We make ordering your favorite food simple, convenient, and
            enjoyable from start to finish.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.id}
                className="group rounded-2xl border border-dark-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-card"
              >
                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-500 transition-all duration-300 group-hover:bg-primary-500 group-hover:text-white">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="font-heading text-lg font-bold text-dark-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-dark-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Row5;

