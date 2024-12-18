import React, { Component, useState } from "react";
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import FormActivity, { FormActivityProps, FormActivityState } from "../../../Sales/Leads/Components/FormActivity";
import ModalSimple from "adios/ModalSimple";
import { getUrlParam } from "adios/Helper";

interface CalendarProps {
  eventsEndpoint: string,
  views?: string,
  height?: any,
  readonly?: boolean,
  onCreateCallback?: any
  onDateClick: any,
  onEventClick: any,
}

interface CalendarState {
  events: Array<any>,
  newFormDateTime?: string,
  dateClicked?: string,
  timeClicked?: string,
}

export default class CalendarComponent extends Component<CalendarProps, CalendarState> {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      dateClicked: "",
      timeClicked: "",
    };
  }

  renderCell = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <span style={{marginLeft: 4}}>{eventInfo.event.title}</span>
        {eventInfo.event.extendedProps.type !== null ? <i style={{marginLeft: 4}}>({eventInfo.event.extendedProps.type})</i> : null}
      </>
    )
  }

  render(): JSX.Element {
    console.log('lead cal render', this.state);
    return (
      <div>
        <FullCalendar
          eventClassNames={"truncate cursor-pointer"}
          height={this.props.height}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          firstDay={1}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: this.props.views ?? 'timeGridDay,timeGridWeek,dayGridMonth'
          }}
          initialView='dayGridMonth'
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false,
          }}
          editable={false}
          selectable={false}
          selectMirror={false}
          dayMaxEvents={true}
          weekends={true}
          events={{url: this.props.eventsEndpoint}}
          //initialEvents={this.state.events} // alternatively, use the `events` setting to fetch from a feed
          //select={handleDateSelect}
          dateClick={(info) => {
            if (this.props.readonly) return;

            const year = info.date.getFullYear();
            const month = String(info.date.getMonth() + 1).padStart(2, '0');
            const day = String(info.date.getDate()).padStart(2, '0');

            const hours = String(info.date.getHours()).padStart(2, '0');
            const minutes = String(info.date.getMinutes()).padStart(2, '0');
            const seconds = String(info.date.getSeconds()).padStart(2, '0');

            const date = `${year}-${month}-${day}`;
            const time = `${hours}:${minutes}:${seconds}`;

            this.props.onDateClick(date, time, info);
          }}
          eventContent={this.renderCell} // custom render function
          eventClick={(info) => this.props.onEventClick(info)}
        />
      </div>
    )
  }
}
