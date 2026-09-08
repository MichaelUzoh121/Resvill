import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageCircleQuestion, ArrowUpRight } from "lucide-react";

const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse the Food Menu, add your favorite dishes to your cart, customize them if needed, and check out. You'll get a confirmation once your order is placed.",
  },
  {
    question: "Can I reserve food in advance for an event?",
    answer:
      "Yes. Head to the Reservation page, tell us your date, time, and number of guests, and we'll prepare your food ahead of time for your event.",
  },
  {
    question: "Do you support group orders?",
    answer:
      "Absolutely. Our Group Order feature lets everyone in your group add their own items to one shared order, so you can split a single delivery.",
  },
  {
    question: "What are your delivery times?",
    answer:
      "Most orders are prepared and delivered within 20-40 minutes depending on your location and order size. Exact times are shown at checkout.",
  },
  {
    question: "Can I customize my order?",
    answer:
      "Yes, most dishes let you choose sizes and add extras before adding them to your cart. Look for the customize option on each food item.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major debit and credit cards as well as popular mobile payment options. You'll see all available methods at checkout.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is confirmed, you can track its status from the Track Order page using your order details.",
  },
  {
    question: "What if I need to cancel or change my order?",
    answer:
      "Contact us as soon as possible after placing your order. If preparation hasn't started, we'll do our best to update or cancel it for you.",
  },
];

function Row2() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-dark-50 px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
                  isOpen ? "border-primary-200 shadow-card" : "border-dark-100 shadow-soft"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
                >
                  <span className="font-heading text-base font-bold text-dark-950 sm:text-lg">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 bg-primary-500 text-white"
                        : "bg-dark-50 text-dark-500"
                    }`}
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-7">
                    <p className="text-sm leading-7 text-dark-500 sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions callout */}
        <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-3xl bg-dark-950 px-6 py-10 text-center sm:flex-row sm:px-10 sm:text-left">
          <div className="flex items-center gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-500 sm:flex">
              <MessageCircleQuestion size={22} className="text-white" />
            </div>

            <div>
              <h3 className="font-heading text-xl font-bold text-white">
                Still have a question?
              </h3>

              <p className="mt-1 text-sm text-dark-300">
                Our team is happy to help with anything else.
              </p>
            </div>
          </div>

          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-600"
          >
            Contact Us
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Row2;
