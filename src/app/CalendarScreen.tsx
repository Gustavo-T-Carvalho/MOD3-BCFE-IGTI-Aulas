import { Box, Button } from '@material-ui/core';

import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import {
  getCalendarsEndpoint,
  getEventsEndpoint,
  ICalendar,
  IEvent,
  IEditingEvent,
} from './backend';
import { CalendarsView } from './CalendarsView';
import { CalendarHeader } from './CalendarHeader';
import { Calendar, ICalendarCell, IEventWithCalendar } from './Calendar';
import { EventFormDialog } from './EventFormDialog';
import { getToday } from './dateFunctions';
import { reducer } from './calendarScreenReducer';

function useCalendarScreenState(month: string) {
  const [state, dispatch] = useReducer(reducer, {
    calendars: [],
    calendarsSelected: [],
    events: [],
    editingEvent: null,
  });

  const { events, calendars, calendarsSelected, editingEvent } = state;
  const weeks = useMemo(() => {
    return generateCalendar(
      month + '-01',
      events,
      calendars,
      calendarsSelected
    );
  }, [month, events, calendars, calendarsSelected]);

  const firstDate = weeks[0][0].date;
  const lastDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([
      getCalendarsEndpoint(),
      getEventsEndpoint(firstDate, lastDate),
    ]).then(([calendars, events]) => {
      dispatch({ type: 'load', payload: { events, calendars } });
      // setCalendarsSelected(calendars.map(() => true));
      // setCalendars(calendars);
      // setEvents(events);
    });
  }, [firstDate, lastDate]);

  function refreshEvents() {
    getEventsEndpoint(firstDate, lastDate).then(() => {
      dispatch({ type: 'load', payload: { events } });
    });
  }
  return {
    weeks,
    calendars,
    dispatch,
    refreshEvents,
    calendarsSelected,
    editingEvent,
  };
}

export function CalendarScreen() {
  const { month } = useParams<{ month: string }>();

  const {
    weeks,
    calendars,
    dispatch,
    refreshEvents,
    calendarsSelected,
    editingEvent,
  } = useCalendarScreenState(month);

  // const toggleCalendar = useMemo(() => {
  //   return (i: number) => {
  //     const newValue = [...calendarsSelected];
  //     newValue[i] = !newValue[i];
  //     setCalendarsSelected(newValue);
  //   };
  // }, [calendarsSelected]);

  const closeDialog = React.useCallback(() => {
    dispatch({ type: 'closeDialog' });
  }, []);

  return (
    <Box display="flex" height="100%" alignItems="stretch">
      <Box
        borderRight="1px solid rgb(224,224,224)"
        width="16em"
        padding="8px 16px"
      >
        <h2> Agenda React</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch({ type: 'new', payload: getToday() })}
        >
          Novo evento
        </Button>

        <CalendarsView
          calendars={calendars}
          dispatch={dispatch}
          calendarsSelected={calendarsSelected}
        />
      </Box>
      <Box display="flex" flex="1" flexDirection="column">
        <CalendarHeader month={month} />

        <Calendar weeks={weeks} dispatch={dispatch} />
        <EventFormDialog
          event={editingEvent}
          onCancel={() => closeDialog()}
          onSave={() => {
            closeDialog();
            refreshEvents();
          }}
          calendars={calendars}
        ></EventFormDialog>
      </Box>
    </Box>
  );
}

function generateCalendar(
  date: string,
  allEvents: IEvent[],
  calendars: ICalendar[],
  calendarsSelected: boolean[]
): ICalendarCell[][] {
  console.log(calendars);
  console.log(allEvents);
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + 'T12:00:00');
  const currentDay = new Date(jsDate.valueOf());
  const currentMonth = jsDate.getMonth();

  currentDay.setDate(1);
  const dayOfWeek = currentDay.getDay();
  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const yearStr = currentDay.getFullYear();
      const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = currentDay.getDate().toString().padStart(2, '0');
      const isoDate = `${yearStr}-${monthStr}-${dayStr}`;

      const events: IEventWithCalendar[] = [];
      for (const event of allEvents) {
        if (event.date === isoDate) {
          const calIndex = calendars.findIndex(
            cal => cal.id === event.calendarId
          );
          if (calendarsSelected[calIndex]) {
            events.push({ ...event, calendar: calendars[calIndex] });
          }
        }
      }

      week.push({
        dayOfMonth: currentDay.getDate().toString(),
        date: isoDate,
        events,
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}
