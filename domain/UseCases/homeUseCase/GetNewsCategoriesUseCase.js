


class GetNewsCategoriesUseCase {
    constructor() {
      // Categories are static data, no repository needed
    }
  
    execute() {
      return [
        new NewsCategory('overview', 'Overview', '📢', '#FF5722'),
        new NewsCategory('kenya', 'Kenya News', '🇰🇪', '#4CAF50'),
        new NewsCategory('africa', 'Africa News', '🌍', '#FF9800'),
        new NewsCategory('global', 'Global News', '🌐', '#2196F3'),
      ];
    }
  }