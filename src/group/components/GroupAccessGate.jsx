import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";

import { useGroupOrderSession } from "../../hooks/useGroupOrderSession";

function GroupAccessGate() {
  const navigate = useNavigate();

  const {
    hasSession,
    groupCode,
  } = useGroupOrderSession();

  const handleContinue = () => {
    if (hasSession && groupCode) {
      navigate(`/group-order/${groupCode}`);
      return;
    }

    navigate("/group-order");
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
          <Users
            size={24}
            className="text-primary-600"
          />
        </div>

        <h1 className="mt-5 text-2xl font-extrabold text-dark-950">
          {hasSession
            ? "Welcome back"
            : "Join a Group Order"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-dark-500">
          {hasSession
            ? "We found your previous group-order session. Continue to return to your group."
            : "Join an existing group order or create a new one."}
        </p>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-primary-700"
        >
          {hasSession
            ? "Return to Group"
            : "Continue"}

          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default GroupAccessGate;