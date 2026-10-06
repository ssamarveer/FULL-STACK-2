import React, { useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarView = React.memo(function CalendarView({ posts, onSelect, onEventClick, onEventChange }) {
  const events = useMemo(() => posts.map(post => ({
    id: post.id,
    title: `${post.platform}: ${post.title}`,
    start: post.start,
    end: post.end,
    extendedProps: { post }
  })), [posts]);

  const click = useCallback(info => onEventClick(info.event.extendedProps.post), [onEventClick]);
  const select = useCallback(info => onSelect(info.start, info.end), [onSelect]);
  const change = useCallback(info => {
    onEventChange(info.event.id, info.event.start, info.event.end);
  }, [onEventChange]);

  return (
    <div className="calendar-wrap">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
        selectable
        editable
        eventResizableFromStart
        events={events}
        eventClick={click}
        select={select}
        eventDrop={change}
        eventResize={change}
        height="auto"
      />
    </div>
  );
});

export default CalendarView;