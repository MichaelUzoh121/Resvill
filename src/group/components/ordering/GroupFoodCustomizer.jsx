import React, { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { toast } from "react-hot-toast";

import { useAddGroupOrderItem } from "../../../hooks/useGroupOrder";
import { useGroupOrderContext } from "../../../context/GroupOrderContext";

function GroupFoodCustomizer({ food, open, onClose }) {
  const { groupOrder, participantId, participantToken, canAddItems } =
    useGroupOrderContext();

  const addItemMutation = useAddGroupOrderItem();

  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setQuantity(1);
    setCustomizations([]);
    setAddOns([]);
    setNotes("");
  }, [open, food?._id]);

  const customizationOptions = useMemo(
    () => food?.customizationOptions || food?.customizations || [],
    [food],
  );

  const addOnOptions = useMemo(
    () => food?.addOns || food?.addOnOptions || [],
    [food],
  );

  if (!open || !food) {
    return null;
  }

  const foodId = food?._id || food?.id;

  const handleCustomizationChange = (option, checked) => {
    const optionId = option?._id || option?.id || option?.name;

    setCustomizations((current) => {
      if (checked) {
        if (
          current.some(
            (item) => (item?._id || item?.id || item?.name) === optionId,
          )
        ) {
          return current;
        }

        return [...current, option];
      }

      return current.filter(
        (item) => (item?._id || item?.id || item?.name) !== optionId,
      );
    });
  };

  const handleAddOnChange = (option, checked) => {
    const optionId = option?._id || option?.id || option?.name;

    setAddOns((current) => {
      if (checked) {
        if (
          current.some(
            (item) => (item?._id || item?.id || item?.name) === optionId,
          )
        ) {
          return current;
        }

        return [...current, option];
      }

      return current.filter(
        (item) => (item?._id || item?.id || item?.name) !== optionId,
      );
    });
  };

  const handleSubmit = async () => {
    if (!canAddItems) {
      toast.error("Items can no longer be added to this group.");
      return;
    }

    if (!groupOrder?._id || !participantId || !participantToken || !foodId) {
      toast.error("Your group participant session is invalid.");
      return;
    }

    try {
      await addItemMutation.mutateAsync({
        groupOrderId: groupOrder._id,

        itemData: {
          participantId,
          participantToken,
          foodId,
          quantity,
          customizations,
          addOns,
          notes: notes.trim(),
        },
      });

      toast.success(`${food?.name || "Item"} added to your order.`);

      onClose?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to add this item.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden bg-dark-950/60 px-4 py-4 backdrop-blur-sm sm:px-6">
      <div
        className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-card sm:max-h-[calc(100vh-3rem)]"
        onMouseDown={(event) => {
          if (
            event.target === event.currentTarget &&
            !addItemMutation.isPending
          ) {
            onClose?.();
          }
        }}
      >
        <div className="relative shrink-0 border-b border-dark-100 bg-primary-50/70 px-5 py-5 sm:px-7">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary-200/40 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-500 shadow-soft">
                <ShoppingBag size={21} strokeWidth={2.2} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-500">
                  Customize item
                </p>

                <h2 className="mt-1 truncate font-heading text-xl font-bold text-dark-900 sm:text-2xl">
                  {food?.name}
                </h2>

                <p className="mt-1 text-sm text-dark-600">
                  Choose your options before adding it.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={addItemMutation.isPending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-600 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-7 p-5 sm:p-7">
            {customizationOptions.length > 0 && (
              <section>
                <div className="mb-3">
                  <h3 className="font-heading text-base font-bold text-dark-900">
                    Customizations
                  </h3>

                  <p className="mt-1 text-xs text-dark-500">
                    Select any options you want with your meal.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* {customizationOptions.map((option) => {
                    const optionId =
                      option?._id ||
                      option?.id ||
                      option?.name;

                    const checked =
                      customizations.some(
                        (item) =>
                          (item?._id ||
                            item?.id ||
                            item?.name) ===
                          optionId,
                      );

                    return (
                      <label
                        key={optionId}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                          checked
                            ? "border-primary-300 bg-primary-50/70 shadow-soft"
                            : "border-dark-100 bg-white hover:border-primary-200 hover:bg-primary-50/40"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-dark-800">
                            {option?.name}
                          </p>

                          {option?.price != null && (
                            <p className="mt-1 text-xs font-medium text-dark-500">
                              +₦
                              {Number(
                                option.price,
                              ).toLocaleString("en-NG")}
                            </p>
                          )}
                        </div>

                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                            checked
                              ? "border-primary-500 bg-primary-500 text-white"
                              : "border-dark-300 bg-white text-transparent"
                          }`}
                        >
                          <Check size={14} strokeWidth={3} />
                        </span>

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) =>
                            handleCustomizationChange(
                              option,
                              event.target.checked,
                            )
                          }
                          className="sr-only"
                        />
                      </label>
                    );
                  })} */}

                  {customizationOptions.map((customization) => (
                    <section key={customization._id || customization.name}>
                      <div className="mb-3">
                        <h3 className="font-heading text-base font-bold text-dark-900">
                          {customization.name}
                        </h3>

                        <p className="mt-1 text-xs text-dark-500">
                          Select an option for your meal.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {(customization.options || [])
                          .filter((option) => option.isAvailable !== false)
                          .map((option) => {
                            const selected = customizations.some(
                              (item) =>
                                item.name === customization.name &&
                                item.option === option.name,
                            );

                            return (
                              <label
                                key={option._id || option.name}
                                className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                                  selected
                                    ? "border-primary-300 bg-primary-50/70 shadow-soft"
                                    : "border-dark-100 bg-white hover:border-primary-200 hover:bg-primary-50/40"
                                }`}
                              >
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-dark-800">
                                    {option.name}
                                  </p>

                                  {option.price != null && (
                                    <p className="mt-1 text-xs font-medium text-dark-500">
                                      +₦
                                      {Number(option.price).toLocaleString(
                                        "en-NG",
                                      )}
                                    </p>
                                  )}
                                </div>

                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                                    selected
                                      ? "border-primary-500 bg-primary-500 text-white"
                                      : "border-dark-300 bg-white text-transparent"
                                  }`}
                                >
                                  <Check size={14} strokeWidth={3} />
                                </span>

                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(event) => {
                                    const checked = event.target.checked;

                                    setCustomizations((current) => {
                                      if (checked) {
                                        if (customization.multiple) {
                                          return [
                                            ...current,
                                            {
                                              name: customization.name,
                                              option: option.name,
                                            },
                                          ];
                                        }

                                        return [
                                          ...current.filter(
                                            (item) =>
                                              item.name !== customization.name,
                                          ),
                                          {
                                            name: customization.name,
                                            option: option.name,
                                          },
                                        ];
                                      }

                                      return current.filter(
                                        (item) =>
                                          !(
                                            item.name === customization.name &&
                                            item.option === option.name
                                          ),
                                      );
                                    });
                                  }}
                                  className="sr-only"
                                />
                              </label>
                            );
                          })}
                      </div>
                    </section>
                  ))}
                </div>
              </section>
            )}

            {addOnOptions.length > 0 && (
              <section>
                <div className="mb-3">
                  <h3 className="font-heading text-base font-bold text-dark-900">
                    Add-ons
                  </h3>

                  <p className="mt-1 text-xs text-dark-500">
                    Make your order exactly how you like it.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {addOnOptions.map((option) => {
                    const optionId = option?._id || option?.id || option?.name;

                    const checked = addOns.some(
                      (item) =>
                        (item?._id || item?.id || item?.name) === optionId,
                    );

                    return (
                      <label
                        key={optionId}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                          checked
                            ? "border-primary-300 bg-primary-50/70 shadow-soft"
                            : "border-dark-100 bg-white hover:border-primary-200 hover:bg-primary-50/40"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-dark-800">
                            {option?.name}
                          </p>

                          {option?.price != null && (
                            <p className="mt-1 text-xs font-medium text-dark-500">
                              +₦
                              {Number(option.price).toLocaleString("en-NG")}
                            </p>
                          )}
                        </div>

                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                            checked
                              ? "border-primary-500 bg-primary-500 text-white"
                              : "border-dark-300 bg-white text-transparent"
                          }`}
                        >
                          <Check size={14} strokeWidth={3} />
                        </span>

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) =>
                            handleAddOnChange(option, event.target.checked)
                          }
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </section>
            )}

            <section>
              <h3 className="font-heading text-base font-bold text-dark-900">
                Quantity
              </h3>

              <div className="mt-3 flex w-fit items-center rounded-2xl border border-dark-200 bg-white p-1 shadow-soft">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-dark-600 transition hover:bg-primary-50 hover:text-primary-500"
                  aria-label="Decrease quantity"
                >
                  <Minus size={17} />
                </button>

                <span className="flex min-w-12 items-center justify-center font-heading text-base font-bold text-dark-900">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => Math.min(99, value + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-dark-600 transition hover:bg-primary-50 hover:text-primary-500"
                  aria-label="Increase quantity"
                >
                  <Plus size={17} />
                </button>
              </div>
            </section>

            <section>
              <label
                htmlFor="group-item-notes"
                className="font-heading text-base font-bold text-dark-900"
              >
                Notes
              </label>

              <p className="mt-1 text-xs text-dark-500">
                Add any special instructions for your order.
              </p>

              <textarea
                id="group-item-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                maxLength={500}
                placeholder="Any special instructions?"
                className="mt-3 w-full resize-none rounded-2xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-100"
              />

              <div className="mt-1 text-right text-xs text-dark-400">
                {notes.length}/500
              </div>
            </section>
          </div>
        </div>

        <div className="shrink-0 border-t border-dark-100 bg-white p-5 sm:p-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={addItemMutation.isPending}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addItemMutation.isPending ? "Adding..." : "Add to my order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupFoodCustomizer;
