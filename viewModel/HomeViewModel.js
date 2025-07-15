// src/viewModel/HomeViewModel.js
export class HomeViewModel {
  constructor(getWeatherUseCase, getNewsUseCase, getDashboardDataUseCase, initialCategory = 'kenya') {
    this.getWeatherUseCase = getWeatherUseCase;
    this.getNewsUseCase = getNewsUseCase;
    this.getDashboardDataUseCase = getDashboardDataUseCase;
    this.state = {
      weatherData: null,
      newsData: [],
      dashboardData: null,
      loading: true,
      error: null,
      selectedNewsCategory: initialCategory,
    };
    console.log('HomeViewModel initialized with category:', initialCategory);
  }

  async loadData() {
    this.state.loading = true;
    this.state.error = null;
    try {
      console.log('HomeViewModel.loadData started');
      const results = await Promise.allSettled([
        this.getWeatherUseCase.execute(),
        this.getNewsUseCase.execute(this.state.selectedNewsCategory),
        this.getDashboardDataUseCase.execute(),
      ]);

      const [weatherResult, newsResult, dashboardResult] = results;
      console.log('Fetch results:', { weather: weatherResult, news: newsResult, dashboard: dashboardResult });

      this.state.weatherData = weatherResult.status === 'fulfilled' ? weatherResult.value : null;
      this.state.newsData = newsResult.status === 'fulfilled' ? newsResult.value || [] : [];
      this.state.dashboardData = dashboardResult.status === 'fulfilled' ? dashboardResult.value : null;

      const errors = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason.message);
      if (errors.length) {
        this.state.error = errors.join('; ');
      }
    } catch (error) {
      console.error('HomeViewModel.loadData error:', error);
      this.state.error = error.message;
    } finally {
      this.state.loading = false;
      console.log('HomeViewModel.loadData completed, state:', this.state);
    }
  }

  async loadNews() {
    this.state.loading = true;
    try {
      console.log('HomeViewModel.loadNews started for category:', this.state.selectedNewsCategory);
      const news = await this.getNewsUseCase.execute(this.state.selectedNewsCategory);
      console.log('Fetched news:', news);
      this.state.newsData = news || [];
    } catch (error) {
      console.error('HomeViewModel.loadNews error:', error);
      this.state.error = error.message;
    } finally {
      this.state.loading = false;
      console.log('HomeViewModel.loadNews completed, state:', this.state);
    }
  }

  async searchNews(query) {
    this.state.loading = true;
    try {
      console.log('HomeViewModel.searchNews started with query:', query);
      const news = await this.getNewsUseCase.execute(query);
      console.log('Searched news:', news);
      this.state.newsData = news || [];
      this.state.error = null;
    } catch (error) {
      console.error('HomeViewModel.searchNews error:', error);
      this.state.error = error.message;
    } finally {
      this.state.loading = false;
      console.log('HomeViewModel.searchNews completed, state:', this.state);
    }
  }

  setSelectedNewsCategory(category) {
    console.log('Setting news category:', category);
    this.state.selectedNewsCategory = category;
    this.loadNews();
  }

  getState() {
    return { ...this.state };
  }
}