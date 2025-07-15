



export class CalendarEvent {
    constructor(date, eventType, isCompleted = false) {
      this.date = date;
      this.eventType = eventType;
      this.isCompleted = isCompleted;
    }
  }