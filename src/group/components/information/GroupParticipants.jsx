import React from "react";
import { Crown, Users } from "lucide-react";

import { useGroupOrderContext } from "../../../context/GroupOrderContext";

function GroupParticipants({ groupOrder }) {
  const { currentParticipant } = useGroupOrderContext();

  const participants = Array.isArray(groupOrder?.participants)
    ? groupOrder.participants
    : [];

  return (
    <section className="rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
            <Users size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-dark-900">
              Participants
            </h2>

            <p className="mt-1 text-sm leading-6 text-dark-600">
              Everyone currently participating in this group
              order.
            </p>
          </div>
        </div>

        <span className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 px-2.5 text-xs font-bold text-primary-600">
          {participants.length}
        </span>
      </div>

      {participants.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-dark-200 bg-dark-50/50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-400">
            <Users size={20} />
          </div>

          <p className="mt-3 text-sm font-semibold text-dark-700">
            No participants yet
          </p>

          <p className="mt-1 text-xs text-dark-500">
            Share the invite link to get people into the
            group.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {participants.map((participant) => {
            const participantId = participant?._id?.toString();

            const currentId =
              currentParticipant?._id?.toString();

            const isCurrentParticipant =
              participantId === currentId;

            const itemCount = Array.isArray(
              participant?.items,
            )
              ? participant.items.length
              : 0;

            const initial =
              participant?.name
                ?.charAt(0)
                ?.toUpperCase() || "?";

            return (
              <div
                key={participantId}
                className={`group flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                  isCurrentParticipant
                    ? "border-primary-200 bg-primary-50/60"
                    : "border-dark-100 bg-white hover:-translate-y-0.5 hover:border-primary-100 hover:shadow-soft"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                      isCurrentParticipant
                        ? "bg-primary-500 text-white"
                        : "bg-dark-100 text-dark-700"
                    }`}
                  >
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="truncate text-sm font-bold text-dark-900">
                        {participant?.name || "Participant"}
                      </p>

                      {participant?.isHost && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-400/15 px-2 py-1 text-[10px] font-bold text-accent-600">
                          <Crown size={11} />
                          Host
                        </span>
                      )}

                      {isCurrentParticipant && (
                        <span className="rounded-full bg-primary-500 px-2 py-1 text-[10px] font-bold text-white">
                          You
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs font-medium text-dark-500">
                      {itemCount}{" "}
                      {itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                <div className="hidden shrink-0 sm:block">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      isCurrentParticipant
                        ? "bg-primary-500"
                        : "bg-success"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default GroupParticipants;