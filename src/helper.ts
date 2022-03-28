import { isAfter, isBefore } from "date-fns";

export function isBetween(
  before: Date | number,
  after: Date | number,
  instant: Date | number
) {
  return isBefore(instant, before) && isAfter(after, instant);
}
