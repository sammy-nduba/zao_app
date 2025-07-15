


export class Alert {
    constructor(id, type, title, message, severity = 'medium') {
      this.id = id;
      this.type = type;
      this.title = title;
      this.message = message;
      this.severity = severity;
    }
  }