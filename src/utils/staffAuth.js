// Staff auth for the demo/prototype staff page. There's no backend yet,
// so this checks against a hardcoded list of staff accounts and remembers
// the signed-in staff member in localStorage - the same pattern the rest
// of this app already uses for customer auth.
//
// IMPORTANT: this is NOT secure. Anyone who opens the browser console can
// read these values, and anyone with the password can sign in from any
// browser. This is meant to unblock building the staff UI now; swap it
// for a real backend + hashed passwords before this goes live for an
// actual restaurant.
//
// To change who can sign in, edit STAFF_ACCOUNTS below.
const STAFF_ACCOUNTS = [
  { username: "admin", password: "resvill2026", name: "Admin", role: "manager" },
  { username: "kitchen", password: "kitchen123", name: "Kitchen Staff", role: "kitchen" },
  { username: "driver", password: "driver123", name: "Resvill Driver", role: "driver" },
];

const STAFF_SESSION_KEY = "resvill_staff_session_v1";

export const loginStaff = (username, password) => {
  const account = STAFF_ACCOUNTS.find(
    (entry) =>
      entry.username.toLowerCase() === String(username).trim().toLowerCase() &&
      entry.password === password,
  );
  if (!account) return { ok: false, message: "Incorrect username or password." };

  const session = { username: account.username, name: account.name, role: account.role };
  localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify(session));
  return { ok: true, session };
};

export const getStaffSession = () => {
  try {
    return JSON.parse(localStorage.getItem(STAFF_SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

export const isStaffSignedIn = () => Boolean(getStaffSession());

export const getDriverAccounts = () =>
  STAFF_ACCOUNTS.filter((account) => account.role === "driver").map(({ username, name, role }) => ({ username, name, role }));

export const logoutStaff = () => {
  localStorage.removeItem(STAFF_SESSION_KEY);
};

