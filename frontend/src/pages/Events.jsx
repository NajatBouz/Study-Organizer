import { useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);

    api.get("/events")
      .then(res => {
        // Events nach Startdatum sortieren
        const sorted = res.data.sort((a, b) => new Date(a.start) - new Date(b.start));
        setEvents(sorted);
      })
      .catch(err => console.log(err));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Ungültiges Datum" : date.toLocaleDateString();
  };

  // Automatisch die Termine ab heute filtern
  const upcomingEvents = events.filter(ev => new Date(ev.start) >= new Date());

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const hasEvent = events.some(ev => {
        const startDate = new Date(ev.start);
        return startDate.toDateString() === date.toDateString();
      });
      return hasEvent ? "event-day" : null;
    }
  };

  return (
    <div>
      <h2>Meine Termine</h2>
      <Calendar
        value={selectedDate}
        tileClassName={tileClassName}
      />
      <ul>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(ev => (
            <li key={ev._id}>
              {ev.title} – {formatDate(ev.start)} bis {formatDate(ev.end)}
            </li>
          ))
        ) : (
          <li>Keine bevorstehenden Termine</li>
        )}
      </ul>

      <style>
        {`
          .event-day {
            background: #4caf50;
            color: white;
            border-radius: 50%;
          }
        `}
      </style>
    </div>
  );
}



