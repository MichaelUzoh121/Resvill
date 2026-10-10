import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Search } from "lucide-react";

import { ROUTES } from "../constants/routes";

function NoPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-white">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full text-center">
          {/* 404 */}
          <div className="relative mx-auto mb-8 w-fit">
            <span
              aria-hidden="true"
              className="font-heading text-[8rem] font-black leading-none tracking-tight text-primary-50 sm:text-[11rem]"
            >
              404
            </span>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-500 shadow-lg shadow-primary-500/20 sm:h-24 sm:w-24">
                <span className="font-heading text-4xl font-black text-white sm:text-5xl">
                  R
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-dark-950 sm:text-4xl">
            Page not found
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-dark-500 sm:text-base sm:leading-7">
            Sorry, we couldn't find the page you're looking for.
            It may have been moved, removed, or the address may be
            incorrect.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={ROUTES.HOME}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-lg sm:w-auto"
            >
              <Home size={18} />
              Go Home
            </Link>

            <Link
              to={ROUTES.MENU}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-6 py-3 text-sm font-bold text-dark-800 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 sm:w-auto"
            >
              <Search size={18} />
              Browse Menu
            </Link>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition-colors hover:text-primary-500"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>
      </section>
    </main>
  );
}

export default NoPage;