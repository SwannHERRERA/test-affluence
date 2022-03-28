import axios from "axios";
import { format } from "date-fns";
import { TimeSlots, TimeTable } from "./time-slot";

const baseUrl = "http://localhost:8080";

export async function getReservations(
  dayOfReservation: Date,
  id: string
): Promise<TimeSlots> {
  const response = await axios.get(`${baseUrl}/reservations`, {
    params: {
      resourceId: id,
      date: format(dayOfReservation, "yyyy-MM-dd"),
    },
  });
  if (!response) {
    throw new Error("Error getting reservations");
  }
  const timetable: TimeTable[] = response.data.reservations.map(
    (reservation) => {
      return {
        start: reservation.reservationStart,
        end: reservation.reservationEnd,
      };
    }
  );
  return { timetable };
}

export async function getOpennings(
  dayOfReservation: Date,
  id: string
): Promise<TimeSlots> {
  const response = await axios.get(`${baseUrl}/timetables`, {
    params: {
      resourceId: id,
      date: format(dayOfReservation, "yyyy-MM-dd"),
    },
  });

  if (!response) {
    throw new Error("Error getting opennings");
  }
  const timetable: TimeTable[] = response.data.timetables.map((timeslot) => {
    return {
      start: timeslot.opening,
      end: timeslot.closing,
    };
  });
  return { timetable };
}
