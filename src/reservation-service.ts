import axios from "axios";
import { format } from "date-fns";
import { TimeSlots } from "./time-slot";

const baseUrl = "http://localhost:8080";

export async function getReservations(
  dayOfReservation: Date,
  id: string
): Promise<TimeSlots> {
  console.log(`${baseUrl}/reservations`);
  const response = await axios.get(`${baseUrl}/reservations`, {
    params: {
      ressourceId: id,
      date: format(dayOfReservation, "yyyy-MM-dd"),
    },
  });
  let result: TimeSlots;
  result.timetable = [];
  if (response) {
    return response.data.reservations.forEach((reservation) => {
      result.timetable.push({
        start: reservation.reservationStart,
        end: reservation.reservationEnd,
      });
    });
  }
  return result;
}

export async function getOpennings(
  dayOfReservation: Date,
  id: string
): Promise<TimeSlots> {
  let response;
  try {
    response = await axios.get(`${baseUrl}/timetables`, {
      params: {
        ressourceId: id,
        date: format(dayOfReservation, "yyyy-MM-dd"),
      },
    });
  } catch (error) {
    console.log(error);
  }
  console.log(response);
  let result: TimeSlots;
  result.timetable = [];
  if (response) {
    return response.data.timetables.forEach((timetable) => {
      result.timetable.push({
        start: timetable.opening,
        end: timetable.closing,
      });
    });
  }
  return result;
}
