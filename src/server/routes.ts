import { isAfter, isBefore } from "date-fns";
import * as Router from "koa-router";

const api = new Router();

api.get("/", async (ctx) => {
    ctx.body = "Hello World!";
});

api.get("/test", async (ctx) => {
    ctx.status = 201;
    ctx.body = "test";
});

api.get("is-available", async (ctx) => {
    const reservations = {
        reservations: [
            {
                reservationStart: "2020-03-19 08:00:00",
                reservationEnd: "2020-03-19 09:00:00",
            },
            {
                reservationStart: "2020-03-19 10:00:00",
                reservationEnd: "2020-03-19 11:00:00",
            },
            {
                reservationStart: "2020-03-19 15:00:00",
                reservationEnd: "2020-03-19 16:00:00",
            },
        ],
    };

    const timetable = {
        open: true,
        timetables: [
            {
                opening: "2020-03-19 08:00:00",
                closing: "2020-03-19 12:00:00",
            },
            {
                opening: "2020-03-19 14:00:00",
                closing: "2020-03-19 18:00:00",
            },
        ],
    };

    const { reservationDateTime } = ctx.request.query;
    const instantOfReservation = Date.parse(reservationDateTime as string);
    let isAvaiable = false;
    timetable.timetables.forEach((openningClosing) => {
        const { opening, closing } = openningClosing;
        const openingDateTime = Date.parse(opening);
        const closingDateTime = Date.parse(closing);
        if (isBetween(openingDateTime, closingDateTime, instantOfReservation)) {
            isAvaiable = true;
        }
    });
    if (!isAvaiable) {
        ctx.body = { avaiable: false };
        ctx.status = 200;
        return;
    }

    reservations.reservations.forEach((resevation) => {
        const { reservationStart, reservationEnd } = resevation;
        const reservationStartDateTime = Date.parse(reservationStart);
        const reservationEndDateTime = Date.parse(reservationEnd);
        if (
            isBetween(
                reservationStartDateTime,
                reservationEndDateTime,
                instantOfReservation
            )
        ) {
            isAvaiable = false;
        }
    });
    ctx.body = { avaiable: isAvaiable };
    ctx.status = 200;
});

function isBetween(
    before: Date | number,
    after: Date | number,
    instant: Date | number
) {
    return isBefore(instant, before) && isAfter(after, instant);
}

export { api };
