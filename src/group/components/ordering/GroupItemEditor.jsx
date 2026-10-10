import React, { useEffect, useState } from "react";
import {
  Loader2,
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";
import {
  useRemoveGroupOrderItem,
  useUpdateGroupOrderItem,
} from "../../../hooks/useGroupOrder";

function GroupItemEditor({
  item,
  open,
  onClose,
}) {
  const {
    groupOrder,
    participantId,
    participantToken,
    canEditItems,
  } = useGroupOrderContext();

  const updateMutation = useUpdateGroupOrderItem();
  const removeMutation = useRemoveGroupOrderItem();

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open || !item) return;

    setQuantity(
      Math.min(
        99,
        Math.max(1, Number(item.quantity) || 1),
      ),
    );

    setNotes(item.notes || "");
  }, [open, item]);

  if (!open || !item || !groupOrder) {
    return null;
  }

  const foodName =
    item?.food?.name ||
    item?.foodName ||
    "Food item";

  const isOpen = groupOrder.status === "open";
  const canManage = canEditItems && isOpen;

  if (!canManage) {
    return null;
  }

  const handleQuantityChange = (value) => {
    const nextValue = Number(value);

    if (!Number.isFinite(nextValue)) {
      setQuantity(1);
      return;
    }

    setQuantity(
      Math.min(99, Math.max(1, Math.floor(nextValue))),
    );
  };

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        groupOrderId: groupOrder._id,
        itemId: item._id,
        itemData: {
          participantId,
          participantToken,
          quantity,
          notes: notes.trim(),
        },
      });

      toast.success("Item updated");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update this item",
      );
    }
  };

  const handleRemove = async () => {
    const confirmed = window.confirm(
      `Remove ${foodName} from your group order?`,
    );

    if (!confirmed) return;

    try {
      await removeMutation.mutateAsync({
        groupOrderId: groupOrder._id,
        itemId: item._id,
        participantData: {
          participantId,
          participantToken,
        },
      });

      toast.success("Item removed");
      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to remove this item",
      );
    }
  };

  const isUpdating = updateMutation.isPending;
  const isRemoving = removeMutation.isPending;
  const isBusy = isUpdating || isRemoving;

  return (
    <div
      className="fixed inset-0 z-[110] flex h-screen w-screen items-center justify-center overflow-hidden bg-dark-950/60 px-4 py-4 backdrop-blur-sm sm:px-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !isBusy
        ) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="relative border-b border-dark-100 bg-primary-50/70 px-5 py-5 sm:px-6">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary-200/40 blur-2xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-500 shadow-soft">
                Edit item
              </span>

              <h2 className="mt-2 font-heading text-xl font-bold text-dark-900">
                {foodName}
              </h2>

              <p className="mt-1 text-sm text-dark-500">
                Update the quantity or special instructions.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-dark-200 bg-white text-dark-500 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        <div className="space-y-7 p-5 sm:p-6">
          <div>
            <label className="mb-3 block text-sm font-bold text-dark-800">
              Quantity
            </label>

            <div className="flex w-fit items-center rounded-2xl border border-dark-200 bg-white p-1 shadow-soft">
              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(quantity - 1)
                }
                disabled={isBusy || quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-dark-600 transition hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus size={17} />
              </button>

              <span className="flex h-10 min-w-12 items-center justify-center font-heading font-bold text-dark-900">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  handleQuantityChange(quantity + 1)
                }
                disabled={isBusy || quantity >= 99}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-dark-600 transition hover:bg-primary-50 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus size={17} />
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="group-item-notes"
              className="mb-2 block text-sm font-bold text-dark-800"
            >
              Notes
            </label>

            <textarea
              id="group-item-notes"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value.slice(0, 500),
                )
              }
              rows={4}
              maxLength={500}
              disabled={isBusy}
              placeholder="Any special instructions?"
              className="w-full resize-none rounded-2xl border border-dark-200 bg-white px-4 py-3 text-sm text-dark-800 outline-none transition placeholder:text-dark-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 disabled:bg-dark-50"
            />

            <p className="mt-1 text-right text-xs text-dark-400">
              {notes.length}/500
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-dark-100 bg-dark-50/40 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <button
            type="button"
            onClick={handleRemove}
            disabled={isBusy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-danger/20 bg-white px-4 text-sm font-bold text-danger transition hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRemoving ? (
              <Loader2
                size={17}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={17} />
            )}

            Remove item
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="min-h-11 rounded-xl border border-dark-200 bg-white px-5 text-sm font-bold text-dark-600 transition hover:bg-dark-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={isBusy}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-bold text-white transition hover:bg-primary-600 hover:shadow-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupItemEditor;