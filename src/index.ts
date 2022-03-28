import axios from "axios";
import { format } from "date-fns";
import * as Koa from "koa";

import { config } from "./server/config";
import { api } from "./server/routes";

const app = new Koa();

const resservationService = "http://localhost:8080";

const today = new Date("2022-03-28");
console.log(today);

const test = axios.get(
    "http://localhost:8080/reservations?date=2022-03-28&resourceId=1337"
);

const reservations = axios.get(`${resservationService}/reservations`, {
    params: {
        ressourceId: "1337",
        date: format(today, "yyyy-MM-dd"),
    },
});

const timetables = axios.get(`${resservationService}/timetables`, {
    params: {
        ressourceId: "1337",
        date: format(today, "yyyy-MM-dd"),
    },
});

app.use(api.routes());

app.listen(config.port);

console.log(`Server running on port ${config.port}`);
