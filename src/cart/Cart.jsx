import React, { useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UserRound,
  UserRoundCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { formatNaira, useCart } from "../context/CartContext";
import { useAuth } from "../hooks/useAuth";

function Cart() {
  const {
    items,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();

  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const [showCheckoutOptions, setShowCheckoutOptions] =
    useState(false);

  const handleProceed = () => {
    if (isAuthenticated) {
      navigate("/checkout");
      return;
    }

    setShowCheckoutOptions(true);
  };

  const handleGuestCheckout = () => {
    navigate("/checkout");
  };

  const handleLogin = () => {
    navigate("/auth/login", {
      state: {
        from: "/checkout",
      },
    });
  };

  if (!items.length) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
        <ShoppingBag
          className="mx-auto text-primary-500"
          size={52}
        />

        <h1 className="mt-5 font-heading text-3xl font-extrabold text-dark-950">
          Your cart is empty
        </h1>

        <p className="mx-auto mt-3 max-w-md text-dark-500">
          Choose something delicious from the menu and it
          will stay here even after you refresh.
        </p>

        <Link
          to="/menu"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-600"
        >
          Browse Menu
          <ArrowRight size={17} />
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-dark-50/50 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary-500">
            Your order
          </p>

          <h1 className="mt-2 font-heading text-3xl font-extrabold text-dark-950">
            Shopping Cart
          </h1>

          <p className="mt-2 text-dark-500">
            Review your items before continuing.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="space-y-4">
            {items.map((item) => {
              const customizations =
                Array.isArray(item.customizations)
                  ? item.customizations
                  : [];

              const addOns = Array.isArray(item.addOns)
                ? item.addOns
                : [];

              return (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-dark-100 bg-white p-4 shadow-soft"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading font-bold text-dark-950">
                          {item.name}
                        </h2>

                        {item.slug && (
                          <Link
                            to={`/menu/${item.slug}`}
                            className="mt-2 inline-block text-xs font-semibold text-primary-500 transition-colors hover:text-primary-600"
                          >
                            Customize your food
                          </Link>
                        )}

                        {customizations.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {customizations.map(
                              (customization, index) => (
                                <p
                                  key={`${customization.name}-${customization.option}-${index}`}
                                  className="text-xs text-dark-500"
                                >
                                  <span className="font-semibold text-dark-700">
                                    {customization.name}:
                                  </span>{" "}
                                  {customization.option}
                                </p>
                              ),
                            )}
                          </div>
                        )}

                        {addOns.length > 0 && (
                          <p className="mt-1 text-xs text-dark-500">
                            <span className="font-semibold text-dark-700">
                              Add-ons:
                            </span>{" "}
                            {addOns
                              .map(
                                (addOn) =>
                                  addOn.name,
                              )
                              .join(", ")}
                          </p>
                        )}

                        {item.notes && (
                          <p className="mt-1 text-xs text-dark-500">
                            <span className="font-semibold text-dark-700">
                              Note:
                            </span>{" "}
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                        className="shrink-0 text-dark-400 transition-colors hover:text-danger"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center rounded-lg border border-dark-200">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1,
                            )
                          }
                          className="p-2 text-dark-600 transition-colors hover:text-primary-500"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={14} />
                        </button>

                        <span className="min-w-8 text-center text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1,
                            )
                          }
                          className="p-2 text-dark-600 transition-colors hover:text-primary-500"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <strong className="font-heading text-dark-950">
                        {formatNaira(
                          item.unitPrice *
                            item.quantity,
                        )}
                      </strong>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="h-fit rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
            <h2 className="font-heading text-xl font-bold text-dark-950">
              Order Summary
            </h2>

            <div className="mt-6 space-y-3 border-t border-dark-100 pt-5 text-sm">
              <div className="flex justify-between text-dark-600">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>

              <div className="flex justify-between border-t border-dark-100 pt-4 text-base font-extrabold text-dark-950">
                <span>Total</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
            </div>

            {isAuthenticated && user ? (
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2 rounded-xl bg-success/5 px-4 py-3 text-sm text-dark-700">
                  <UserRoundCheck
                    size={17}
                    className="shrink-0 text-success"
                  />

                  <span>
                    Signed in as{" "}
                    <strong>
                      {user.firstname ||
                        user.firstName ||
                        user.email}
                    </strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProceed}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
                >
                  Proceed to Checkout
                  <ArrowRight size={17} />
                </button>
              </div>
            ) : (
              <div className="mt-6">
                {!showCheckoutOptions ? (
                  <button
                    type="button"
                    onClick={handleProceed}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
                  >
                    Continue to Checkout
                    <ArrowRight size={17} />
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-dark-800">
                      How would you like to continue?
                    </p>

                    <button
                      type="button"
                      onClick={handleGuestCheckout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark-200 bg-white px-5 py-3.5 text-sm font-bold text-dark-800 transition-colors hover:border-primary-300 hover:text-primary-500"
                    >
                      Continue as Guest
                    </button>

                    <button
                      type="button"
                      onClick={handleLogin}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-600"
                    >
                      <UserRound size={17} />
                      Login / Create Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Cart;

