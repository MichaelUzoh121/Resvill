import React from "react";
import {
  Link2,
  Users,
  Utensils,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function Row2() {
  const steps = [
    {
      number: "01",
      icon: Users,
      title: "Create a Group",
      description:
        "Start a group order and give it a name, such as Office Lunch or Friday Dinner.",
    },
    {
      number: "02",
      icon: Link2,
      title: "Share the Link",
      description:
        "Invite your friends, family, colleagues, or teammates by sharing your unique group link.",
    },
    {
      number: "03",
      icon: Utensils,
      title: "Everyone Chooses",
      description:
        "Each person browses the menu and adds their own food, extras, and customizations.",
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Place One Order",
      description:
        "Review everyone's selections, complete payment, and we'll prepare everything together.",
    },
  ];

  return (
    <section id="group-order-steps" className="py-16 sm:py-20 lg:py-24">
      {/* Heading */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex rounded-full bg-primary-50 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-primary-600">
          Simple & Convenient
        </span>

        <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-dark-950 sm:text-4xl">
          Group ordering made{" "}
          <span className="text-primary-500">simple</span>
        </h2>

        <p className="mt-4 text-sm leading-7 text-dark-500 sm:text-base">
          No more collecting everyone's orders in a group chat. Create a
          group, share the link, and let everyone pick exactly what they want.
        </p>
      </div>

      {/* Steps */}
      <div className="relative mx-auto mt-12 max-w-6xl">
        {/* Connecting Line */}
        <div className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-dark-100 lg:block" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-dark-100 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card"
              >
                {/* Number + Icon */}
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <Icon size={21} />
                  </div>

                  {/* Step Number */}
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-dark-950 text-[10px] font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-primary-500">
                    Step {step.number}
                  </p>

                  <h3 className="mt-2 font-heading text-lg font-bold text-dark-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-dark-500">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="mt-5 flex justify-center text-dark-200 lg:hidden">
                    <ArrowRight size={18} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Message */}
      <div className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center text-sm font-medium text-dark-500">
        <CheckCircle2 size={17} className="shrink-0 text-primary-500" />

        <span>
          Everyone gets to choose their own meal while you manage one order.
        </span>
      </div>
    </section>
  );
}

export default Row2;