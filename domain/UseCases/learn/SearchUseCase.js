export class SearchUseCase {
    constructor(searchRepository) {
      this.searchRepository = searchRepository;
    }
  
    async execute(query) {
      return await this.searchRepository.search(query);
    }
  }