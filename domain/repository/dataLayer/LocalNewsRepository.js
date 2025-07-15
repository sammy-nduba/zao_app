import { NewsRepository}  from '../NewsRepository';
import { NewsArticle} from '../../entities/NewsArticle';



export class LocalNewsRepository extends NewsRepository {
    constructor() {
      super();
      this.articles = [
        new NewsArticle(
          1,
          'Government Announces Subsidy for Avocado Farmers',
          'New agricultural support program launched to boost avocado production',
          'Ministry of Agriculture',
          '4 min read',
          12000,
          'avocado_tree.jpg',
          'kenya'
        ),
        new NewsArticle(
          2,
          'Avocado Prices Rise in Local and Export Markets',
          'Market analysis shows significant price increases across all markets',
          'Kenya Export',
          '4 min read',
          12000,
          'avocado_market.jpg',
          'kenya'
        )
      ];
    }
    
    async getLatestNews(category = 'all') {
      if (category === 'all') return [...this.articles];
      return this.articles.filter(article => article.category === category);
    }
  }