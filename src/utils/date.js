export const buildScheduledDateTime = (
  date,
  time,
) => {
  if (!date || !time) {
    return null;
  }


  const [year, month, day] = date.split("-");

  const [hours, minutes] = time.split(":");


  const scheduledDate = new Date();


  scheduledDate.setFullYear(
    Number(year),
    Number(month) - 1,
    Number(day),
  );


  scheduledDate.setHours(
    Number(hours),
    Number(minutes),
    0,
    0,
  );


  return scheduledDate;
};



export const formatScheduledDate = (
  value,
) => {

  if (!value) {
    return "";
  }


  return new Intl.DateTimeFormat(
    "en-NG",
    {
      dateStyle: "full",
      timeStyle: "short",
    },
  ).format(
    new Date(value),
  );

};