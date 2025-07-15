


export class Task {
    constructor(id, title, type, completed = false, dueDate = null) {
      this.id = id;
      this.title = title;
      this.type = type;
      this.completed = completed;
      this.dueDate = dueDate;
    }
  }