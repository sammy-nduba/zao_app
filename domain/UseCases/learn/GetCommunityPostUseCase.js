export class GetCommunityPostsUseCase {
    constructor(communityRepository) {
      this.communityRepository = communityRepository;
    }
  
    async execute() {
      return await this.communityRepository.getPosts();
    }
  }