export function getTodayUTC() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export function getWeekStartUTC() {
  const now = new Date();
  const day = now.getUTCDay();
  now.setUTCDate(now.getUTCDate() - ((day + 6) % 7));
  return now.toISOString().split("T")[0];
}

export const LOCAL_TIME_OFFSET = "+7 hours";
