import { NewsRepository } from '../../domain/repository/NewsRepository';
import { NewsArticle } from '../../domain/entities/NewsArticle';

export class ApiNewsRepository extends NewsRepository {
  constructor(apiClient) {
    super();
    this.apiClient = apiClient;
  }

  async getLatestNews(category = 'agriculture') {
    try {
      const query = category === 'agriculture' ? 'agriculture' : `agriculture ${category}`;
      const response = await this.apiClient.get(`/everything?q=${query}&apiKey=b3075ce86ddd47b2866543f66c7bc382&language=en&sortBy=publishedAt`);
      return response.articles.map((article, index) => new NewsArticle(
        index + 1,
        article.title,
        article.description || 'No description available',
        article.author || 'Unknown',
        '4 min read', // Placeholder
        Math.floor(Math.random() * 15000), // Simulated likes
        article.urlToImage || 'https://via.placeholder.com/340x174',
        category
      ));
    } catch (error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  }
}