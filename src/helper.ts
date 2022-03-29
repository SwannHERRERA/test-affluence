import { isAfter, isBefore } from "date-fns";

export function isBetween(
  start: Date | number,
  end: Date | number,
  instant: Date | number
) {
  return isBefore(instant, end) && isAfter(instant, start);
}
