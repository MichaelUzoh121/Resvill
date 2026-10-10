import { CalendarClock } from "lucide-react";
import { toast } from "react-hot-toast";


const getTodayDate = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


function ScheduleOrderSelector({
  orderTiming,
  setOrderTiming,

  scheduledDate,
  setScheduledDate,

  scheduledTime,
  setScheduledTime,

  disabled,
}) {


  return (
    <section className="rounded-2xl border border-dark-100 bg-white p-5 shadow-soft sm:p-6">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500">
          <CalendarClock size={21} />
        </div>


        <div>

          <h2 className="font-heading text-xl font-bold text-dark-950">
            When would you like your order?
          </h2>


          <p className="text-sm text-dark-500">
            Order now or choose a future date and time.
          </p>

        </div>

      </div>



      <div className="mt-5 grid gap-3 sm:grid-cols-2">


        <button
          type="button"
          disabled={disabled}
          onClick={() => setOrderTiming("now")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            orderTiming === "now"
              ? "border-primary-500 bg-primary-50 text-primary-700"
              : "border-dark-200 text-dark-700 hover:border-primary-300"
          }`}
        >

          <span className="block font-bold">
            Order now
          </span>


          <span className="mt-1 block text-xs text-dark-500">
            Prepare my order as soon as possible.
          </span>

        </button>



        <button
          type="button"
          disabled={disabled}
          onClick={() => setOrderTiming("scheduled")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            orderTiming === "scheduled"
              ? "border-primary-500 bg-primary-50 text-primary-700"
              : "border-dark-200 text-dark-700 hover:border-primary-300"
          }`}
        >

          <span className="block font-bold">
            Schedule for later
          </span>


          <span className="mt-1 block text-xs text-dark-500">
            Choose when you want your order.
          </span>

        </button>


      </div>



      {
        orderTiming === "scheduled" && (

          <div className="mt-4 grid gap-4 sm:grid-cols-2">


            <label className="text-sm font-semibold text-dark-700">

              Date

              <input
                required
                type="date"
                min={getTodayDate()}
                value={scheduledDate}
                onChange={(event) =>
                  setScheduledDate(event.target.value)
                }
                disabled={disabled}
                className="mt-2 w-full rounded-xl border border-dark-200 bg-white px-4 py-3 font-normal outline-none focus:border-primary-500 disabled:bg-dark-50"
              />

            </label>



            <label className="text-sm font-semibold text-dark-700">

              Time

              <input
                required
                type="time"
                value={scheduledTime}
                onChange={(event) =>
                  setScheduledTime(event.target.value)
                }
                disabled={disabled}
                className="mt-2 w-full rounded-xl border border-dark-200 bg-white px-4 py-3 font-normal outline-none focus:border-primary-500 disabled:bg-dark-50"
              />

            </label>


          </div>

        )
      }


    </section>
  );
}


export default ScheduleOrderSelector;