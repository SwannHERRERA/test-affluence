import Router from "koa-router";
import { isBetween } from "./helper";
import { getOpennings, getReservations } from "./reservation-service";
import { TimeSlots } from "./time-slot";

function isNotBetweenOtherReservation(
  reservations: TimeSlots,
  instantOfReservation: number
) {
  reservations.timetable.forEach((resevation) => {
    const { start, end } = resevation;
    const startDateTime = Date.parse(start);
    const endDateTime = Date.parse(end);
    if (isBetween(startDateTime, endDateTime, instantOfReservation)) {
      return false;
    }
  });
  return true;
}

function isBetweenOpenningTimeSlot(
  opennings: TimeSlots,
  instantOfReservation: number
): boolean {
  opennings.timetable.forEach((openningClosing) => {
    const { start, end } = openningClosing;
    const openingDateTime = Date.parse(start);
    const closingDateTime = Date.parse(end);
    if (isBetween(openingDateTime, closingDateTime, instantOfReservation)) {
      return true;
    }
  });
  return false;
}

const router = new Router({ prefix: "/api" });

router.get("/is-available", async (ctx) => {
  const today = new Date();
  const id = "1337";
  const opennings = await getOpennings(today, id);
  const reservations = await getReservations(today, id);

  const { reservationDateTime } = ctx.request.query;
  const instantOfReservation = Date.parse(reservationDateTime as string);
  if (!isBetweenOpenningTimeSlot(opennings, instantOfReservation)) {
    ctx.body = { avaiable: false };
    ctx.status = 200;
    return;
  }
  const isAvaiable = isNotBetweenOtherReservation(
    reservations,
    instantOfReservation
  );
  ctx.body = { avaiable: isAvaiable };
  ctx.status = 200;
});

export default router;
