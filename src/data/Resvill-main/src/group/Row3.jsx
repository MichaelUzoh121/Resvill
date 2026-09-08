import React, { useState } from "react";
import {
  ArrowRight,
  Clock3,
  Copy,
  Link2,
  Search,
  Users,
  Utensils,
} from "lucide-react";
import { toast } from "react-hot-toast";

function Row3() {
  const [groupCode, setGroupCode] = useState("");

  const activeGroups = [
    {
      id: 1,
      name: "Friday Office Lunch",
      host: "Michael",
      members: 8,
      items: 12,
      timeLeft: "24 mins left",
      code: "FRIDAY24",
    },
    {
      id: 2,
      name: "Weekend Hangout",
      host: "Sarah",
      members: 5,
      items: 7,
      timeLeft: "41 mins left",
      code: "HANGOUT7",
    },
    {
      id: 3,
      name: "Family Dinner",
      host: "Daniel",
      members: 4,
      items: 6,
      timeLeft: "58 mins left",
      code: "FAMILY58",
    },
  ];

  const handleJoin = (code = groupCode) => {
    if (!code.trim()) {
      toast.error("Enter a group code or invite link");
      return;
    }

    toast.success(`Joining group ${code.toUpperCase()}...`);
  };

  const handleCopy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Group code copied");
    } catch {
      toast.error("Unable to copy group code");
    }
  };

  return (
    <section className="bg-dark-50/60 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-primary-600 shadow-sm">
            <Users size={14} />
            Join a Group
          </span>

          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-dark-950 sm:text-4xl">
            Already have a{" "}
            <span className="text-primary-500">group order?</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-dark-500 sm:text-base">
            Enter the group code shared by your host or choose an active group
            below to start adding your food.
          </p>
        </div>

        {/* Join Card */}
        <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-dark-100 bg-white p-5 shadow-soft sm:p-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
              <Link2 size={19} />
            </div>

            <div>
              <h3 className="font-heading text-base font-bold text-dark-950">
                Join with a group code
              </h3>

              <p className="mt-1 text-xs text-dark-400">
                Paste the code or invitation link you received.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400"
              />

              <input
                type="text"
                value={groupCode}
                onChange={(event) => setGroupCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleJoin();
                  }
                }}
                placeholder="Enter group code or link"
                className="h-12 w-full rounded-xl border border-dark-200 bg-white pl-11 pr-4 text-sm font-medium text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
              />
            </div>

            <button
              type="button"
              onClick={() => handleJoin()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-500 px-6 text-sm font-bold text-white transition-all hover:bg-primary-600 hover:shadow-hover"
            >
              Join Group
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* Active Groups */}
        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary-500">
                Active Now
              </p>

              <h3 className="mt-2 font-heading text-2xl font-extrabold text-dark-950">
                Open group orders
              </h3>
            </div>

            <span className="hidden text-xs font-medium text-dark-400 sm:block">
              {activeGroups.length} groups available
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {activeGroups.map((group) => (
              <article
                key={group.id}
                className="group rounded-2xl border border-dark-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-card"
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
                    <Utensils size={19} />
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1.5 text-[10px] font-bold text-primary-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                    Active
                  </div>
                </div>

                {/* Group Info */}
                <div className="mt-5">
                  <h4 className="font-heading text-base font-bold text-dark-950">
                    {group.name}
                  </h4>

                  <p className="mt-1 text-xs text-dark-400">
                    Hosted by {group.host}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-dark-50 p-3">
                    <div className="flex items-center gap-1.5 text-dark-400">
                      <Users size={14} />

                      <span className="text-[10px] font-semibold uppercase tracking-wide">
                        Members
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-bold text-dark-800">
                      {group.members} people
                    </p>
                  </div>

                  <div className="rounded-xl bg-dark-50 p-3">
                    <div className="flex items-center gap-1.5 text-dark-400">
                      <Utensils size={14} />

                      <span className="text-[10px] font-semibold uppercase tracking-wide">
                        Items
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-bold text-dark-800">
                      {group.items} items
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-dark-500">
                  <Clock3 size={14} className="text-primary-500" />
                  {group.timeLeft}
                </div>

                {/* Actions */}
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleJoin(group.code)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-primary-600"
                  >
                    Join Group
                    <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(group.code)}
                    aria-label={`Copy ${group.name} group code`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dark-200 text-dark-500 transition-colors hover:border-primary-300 hover:text-primary-500"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Row3;