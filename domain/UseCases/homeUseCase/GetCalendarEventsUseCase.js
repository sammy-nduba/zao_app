



export class GetCalendarEventsUseCase {
    constructor(taskRepository) {
      this.taskRepository = taskRepository;
    }
    
    async execute() {
      return await this.taskRepository.getCalendarEvents();
    }
  }