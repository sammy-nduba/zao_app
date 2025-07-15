

export class GetTasksUseCase {
    constructor(taskRepository) {
      this.taskRepository = taskRepository;
    }
    
    async execute() {
      return await this.taskRepository.getTasks();
    }
  }