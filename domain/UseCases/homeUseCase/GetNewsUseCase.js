

import NetInfo from '@react-native-community/netinfo';

export class GetNewsUseCase {
  constructor(newsRepository, asyncStorageNewsRepository) {
    this.newsRepository = newsRepository;
    this.asyncStorageNewsRepository = asyncStorageNewsRepository;
  }

  async execute(category, userId) {
    try {
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected;

      if (!isOnline) {
        console.log('GetNewsUseCase.execute: Offline, using AsyncStorage');
        const cachedNews = await this.asyncStorageNewsRepository.getNews(userId);
        if (cachedNews) {
          console.log('GetNewsUseCase.execute: Retrieved from AsyncStorage', cachedNews);
          return cachedNews;
        }
        throw new Error('No cached news data available offline');
      }

      console.log('GetNewsUseCase.execute called with category:', category);
      const news = await this.newsRepository.getLatestNews(category === 'all' ? '' : category);
      if (news) {
        await this.asyncStorageNewsRepository.saveNews(news, userId);
        console.log('GetNewsUseCase.execute: Saved to AsyncStorage', news);
      }
      console.log('GetNewsUseCase result:', news);
      return news;
    } catch (error) {
      console.warn('GetNewsUseCase.execute: Error, trying AsyncStorage', error.message);
      try {
        const cachedNews = await this.asyncStorageNewsRepository.getNews(userId);
        if (cachedNews) {
          console.log('GetNewsUseCase.execute: Retrieved from AsyncStorage', cachedNews);
          return cachedNews;
        }
      } catch (storageError) {
        console.error('GetNewsUseCase.execute: AsyncStorage failed', storageError.message);
      }
      throw new Error(error.message.includes('502') || error.message.includes('timed out')
        ? 'You are offline. No cached news data available.'
        : `Failed to fetch news: ${error.message}`);
    }
  }
}