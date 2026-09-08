import React from "react";
import { Mail, Phone, MapPin, Clock3 } from "lucide-react";

const infoCards = [
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+234 000 000 0000"],
    href: "tel:+2340000000000",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["hello@resvill.com"],
    href: "mailto:hello@resvill.com",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["Lagos, Nigeria"],
  },
  {
    icon: Clock3,
    title: "Opening Hours",
    lines: ["Mon - Sun: 9AM - 10PM"],
  },
];

function Row1() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2">
          <Mail size={15} className="text-primary-500" />

          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
            Contact Us
          </span>
        </div>

        <h1 className="mx-auto mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-dark-950 sm:text-5xl">
          We'd love to
          <span className="block text-primary-500">hear from you.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-dark-500 sm:text-lg">
          Questions, feedback, or planning something special? Reach out
          and our team will get back to you shortly.
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card) => {
            const Icon = card.icon;
            const content = (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
                  <Icon size={21} />
                </div>

                <h3 className="mt-4 font-heading text-sm font-bold text-dark-950">
                  {card.title}
                </h3>

                {card.lines.map((line) => (
                  <p key={line} className="mt-1 text-sm text-dark-500">
                    {line}
                  </p>
                ))}
              </>
            );

            return card.href ? (
              <a
                key={card.title}
                href={card.href}
                className="rounded-3xl border border-dark-100 bg-white p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-card"
              >
                {content}
              </a>
            ) : (
              <div
                key={card.title}
                className="rounded-3xl border border-dark-100 bg-white p-6 text-center shadow-soft"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Row1;
