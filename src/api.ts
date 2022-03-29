import Router from "koa-router";
import { isBetween } from "./helper";
import { getOpennings, getReservations } from "./reservation-service";
import { TimeSlots } from "./time-slot";

function isNotBetweenOtherReservation(
  reservations: TimeSlots,
  instantOfReservation: Date
) {
  return reservations.timetable.every((resevation) => {
    const { start, end } = resevation;
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);
    return !isBetween(startDateTime, endDateTime, instantOfReservation);
  });
}

function isNotBetweenOpenningTimeSlot(
  opennings: TimeSlots,
  instantOfReservation: Date
): boolean {
  return opennings.timetable.every((openningClosing) => {
    const { start, end } = openningClosing;
    const openingDateTime = new Date(start);
    const closingDateTime = new Date(end);
    return !isBetween(openingDateTime, closingDateTime, instantOfReservation);
  });
}

const router = new Router({ prefix: "/api" });

router.get("/is-available", async (ctx) => {
  const today = new Date();
  const id = "1337";
  const opennings = await getOpennings(today, id);
  const reservations = await getReservations(today, id);

  const { reservationDateTime } = ctx.request.query;
  const instantOfReservation = new Date(reservationDateTime as string);
  if (isNotBetweenOpenningTimeSlot(opennings, instantOfReservation)) {
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
