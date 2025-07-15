import { TaskRepository } from "../TaskRepository";
import { Task } from "../../../models/crop-instights/Task";
import { CalendarEvent } from "../../../models/crop-instights/CalenderEvent";



export class LocalTaskRepository extends TaskRepository {
    constructor() {
      super();
      this.tasks = [
        new Task(1, 'Conduct Soil Test', 'soil_test', false),
        new Task(2, 'Book Agronomist', 'agronomist', false),
        new Task(3, 'Visit Nearby Farmer', 'visit', false)
      ];
      
      this.calendarEvents = [
        new CalendarEvent('2025-07-09', 'soil_test', true),
        new CalendarEvent('2025-07-11', 'visit', false),
        new CalendarEvent('2025-07-14', 'agronomist', false),
        new CalendarEvent('2025-07-23', 'soil_test', true),
        new CalendarEvent('2025-07-24', 'visit', true),
        new CalendarEvent('2025-07-29', 'harvest', false),
        new CalendarEvent('2025-07-30', 'harvest', false),
        new CalendarEvent('2025-07-31', 'harvest', false)
      ];
    }
    
    async getTasks() {
      return [...this.tasks];
    }
    
    async getCalendarEvents() {
      return [...this.calendarEvents];
    }
  }