import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Quote, Star, BadgeCheck } from "lucide-react";
import reviews from "../data/reviews";

function Row7() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 block text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
            Customer love
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-dark-900 sm:text-4xl lg:text-5xl">
            What our customers{" "}
            <span className="text-primary-500">say</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-dark-600 sm:text-base">
            Thousands of happy customers trust Resvill for delicious meals
            delivered straight to their door.
          </p>
        </div>

        {/* Reviews */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="group flex h-full flex-col rounded-2xl border border-dark-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-card"
            >
              {/* Quote Icon */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                  <Quote size={19} fill="currentColor" strokeWidth={1.5} />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star
                    size={15}
                    fill="currentColor"
                    className="text-accent-500"
                  />

                  <span className="text-sm font-bold text-dark-800">
                    {review.rating}.0
                  </span>
                </div>
              </div>

              {/* Review */}
              <p className="flex-1 text-sm leading-7 text-dark-600">
                &quot;{review.review}&quot;
              </p>

              {/* Food Ordered */}
              <div className="mt-5 border-t border-dark-100 pt-4">
                <p className="text-xs font-semibold text-dark-400">
                  Ordered
                </p>

                <p className="mt-1 text-xs font-bold text-dark-800">
                  {review.food}
                </p>
              </div>

              {/* Customer */}
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-dark-100"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-bold text-dark-900">
                      {review.name}
                    </h3>

                    <BadgeCheck
                      size={15}
                      className="shrink-0 text-primary-500"
                    />
                  </div>

                  <p className="mt-0.5 text-xs text-dark-500">
                    {review.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 text-sm font-bold text-dark-900 transition-colors hover:text-primary-500"
          >
            Order something delicious
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

export default Row7;

