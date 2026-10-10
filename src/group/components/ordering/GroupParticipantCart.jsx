import React, { useState } from "react";
import {
  ChevronRight,
  Pencil,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import GroupItemEditor from "./GroupItemEditor";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";

function formatNaira(value) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

function getFoodName(item) {
  if (typeof item?.food === "string") {
    return "Food item";
  }

  return (
    item?.food?.name ||
    item?.foodName ||
    "Food item"
  );
}

function GroupParticipantCart() {
  const {
    groupOrder,
    currentParticipant,
    canEditItems,
  } = useGroupOrderContext();

  const [selectedItem, setSelectedItem] =
    useState(null);

  if (!groupOrder || !currentParticipant) {
    return null;
  }

  const items = Array.isArray(
    currentParticipant.items,
  )
    ? currentParticipant.items
    : [];

  const isOpen = groupOrder.status === "open";
  const canManageItems =
    canEditItems && isOpen;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6 lg:p-7">
      <div className="pointer-events-none absolute -left-16 -top-16 h-32 w-32 rounded-full bg-primary-100/60 blur-3xl" />

      <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
            <ShoppingBag size={22} strokeWidth={2.2} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-dark-900">
                Your items
              </h2>

              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-500">
                {items.length}{" "}
                {items.length === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <p className="mt-1 text-sm text-dark-600">
              Items you added to this group order.
            </p>
          </div>
        </div>

        {!isOpen && (
          <span className="w-fit rounded-full bg-dark-100 px-3 py-1.5 text-xs font-bold text-dark-600">
            Editing locked
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-dark-200 bg-dark-50/50 px-5 py-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-400">
            <ShoppingBag size={27} />
          </div>

          <h3 className="mt-4 font-heading text-base font-bold text-dark-800">
            You haven't added anything yet
          </h3>

          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-dark-500">
            Choose something from the menu above to
            add it to the group order.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const foodName = getFoodName(item);

            return (
              <div
                key={item._id}
                className="group rounded-2xl border border-dark-100 bg-white p-4 transition hover:border-primary-200 hover:shadow-soft sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-sm font-bold text-dark-900 sm:text-base">
                        {foodName}
                      </h3>

                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-500">
                        ×{item.quantity}
                      </span>
                    </div>

                    {Array.isArray(
                      item.customizations,
                    ) &&
                      item.customizations.length > 0 && (
                        <div className="mt-3 text-sm text-dark-500">
                          <span className="font-semibold text-dark-700">
                            Customizations:
                          </span>{" "}
                          {item.customizations
                            .map((customization) => {
                              if (
                                typeof customization ===
                                "string"
                              ) {
                                return customization;
                              }

                              return (
                                customization?.name ||
                                customization?.label ||
                                customization?.value ||
                                ""
                              );
                            })
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}

                    {Array.isArray(item.addOns) &&
                      item.addOns.length > 0 && (
                        <div className="mt-1 text-sm text-dark-500">
                          <span className="font-semibold text-dark-700">
                            Add-ons:
                          </span>{" "}
                          {item.addOns
                            .map((addOn) => {
                              if (
                                typeof addOn ===
                                "string"
                              ) {
                                return addOn;
                              }

                              return (
                                addOn?.name ||
                                addOn?.label ||
                                addOn?.value ||
                                ""
                              );
                            })
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      )}

                    {item.notes && (
                      <p className="mt-1 text-sm text-dark-500">
                        <span className="font-semibold text-dark-700">
                          Note:
                        </span>{" "}
                        {item.notes}
                      </p>
                    )}

                    <p className="mt-3 text-xs font-medium text-dark-400">
                      {formatNaira(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-dark-100 pt-3 sm:min-w-[150px] sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <p className="font-heading text-base font-bold text-dark-900">
                      {formatNaira(item.total)}
                    </p>

                    {canManageItems && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedItem(item)
                          }
                          disabled={!canManageItems}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Edit item"
                          aria-label={`Edit ${foodName}`}
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          disabled
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-300"
                          title="Remove item"
                          aria-label={`Remove ${foodName}`}
                        >
                          <Trash2 size={15} />
                        </button>

                        <ChevronRight
                          size={15}
                          className="hidden text-dark-300 sm:block"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GroupItemEditor
        item={selectedItem}
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}

export default GroupParticipantCart;