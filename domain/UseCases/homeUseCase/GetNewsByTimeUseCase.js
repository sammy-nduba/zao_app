

class GetNewsByTimeUseCase {
  constructor(newsRepository) {
    this.newsRepository = newsRepository;
  }

  async execute(timeframe = '1hr') {
    try {
      // In a real implementation, you'd filter by time
      // For now, we'll get all news and simulate time filtering
      const news = await this.newsRepository.getLatestNews('agriculture');
      
      // Simulate time-based filtering
      return news.map((article, index) => ({
        ...article,
        timeAgo: this.generateTimeAgo(index),
        readTime: '4 min read'
      }));
    } catch (error) {
      throw new Error(`Failed to fetch news by time: ${error.message}`);
    }
  }

  generateTimeAgo(index) {
    const times = ['1hr', '2hr', '3hr', '4hr', '5hr'];
    return times[index % times.length];
  }
}