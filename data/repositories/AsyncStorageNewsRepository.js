import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageNewsRepository {
  async saveNews(newsData, userId) {
    if (!userId) throw new Error('User ID is required for saving news data');
    const key = `@ZaoAPP:NewsData:${userId}`;
    try {
      console.log('AsyncStorageNewsRepository.saveNews:', { key, newsData });
      await AsyncStorage.setItem(key, JSON.stringify(newsData));
      return newsData;
    } catch (error) {
      console.error('AsyncStorageNewsRepository.saveNews error:', error.message);
      throw new Error('Failed to save news data');
    }
  }

  async getNews(userId) {
    if (!userId) throw new Error('User ID is required for retrieving news data');
    const key = `@ZaoAPP:NewsData:${userId}`;
    try {
      console.log('AsyncStorageNewsRepository.getNews:', { key });
      const data = await AsyncStorage.getItem(key);
      const news = data ? JSON.parse(data) : null;
      console.log('AsyncStorageNewsRepository.getNews result:', news);
      return news;
    } catch (error) {
      console.error('AsyncStorageNewsRepository.getNews error:', error.message);
      throw new Error('Failed to retrieve news data');
    }
  }
}