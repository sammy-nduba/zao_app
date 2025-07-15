// src/screens/LatestNewsScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import container from '../../infrastructure/di/Container';
import { HomeViewModel } from '../../viewModel/HomeViewModel';
import Header from '../../components/newsComponents/Header';
import SearchBar from '../../components/newsComponents/SearchBar';
import CategoriesSection from '../../components/newsComponents/CategoriesSection';
import NewsCard from '../../components/newsComponents/NewsCard';

// Predefined categories compatible with ApiNewsRepository
const categories = [
  { id: 'kenya', name: 'Kenya', icon: '🇰🇪', color: '#4CAF50' },
  { id: 'africa', name: 'Africa', icon: '🌍', color: '#FF9800' },
  { id: 'global', name: 'Global', icon: '🌐', color: '#2196F3' },
  { id: 'overview', name: 'Overview', icon: '📰', color: '#9C27B0' },
];

const LatestNewsScreen = ({ navigation, route }) => {
  const [viewModel] = useState(() =>
    new HomeViewModel(
      container.get('getWeatherUseCase'),
      container.get('getNewsUseCase'),
      container.get('getDashboardDataUseCase'),
      route?.params?.category || 'kenya'
    )
  );
  const [state, setState] = useState(viewModel.getState());
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeout = useRef(null);

  // Log props for debugging
  console.log('Navigation:', navigation);
  console.log('Route:', route);

  useEffect(() => {
    const loadData = async () => {
      console.log('LatestNewsScreen: Loading data');
      await viewModel.loadNews();
      const newState = viewModel.getState();
      console.log('LatestNewsScreen: State updated:', newState);
      setState(newState);
      if (newState.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: newState.error,
        });
      }
    };
    loadData();
  }, [viewModel]);

  const handleSearch = async (query) => {
    if (query.trim()) {
      await viewModel.searchNews(query);
      setState(viewModel.getState());
    } else {
      await viewModel.loadNews();
      setState(viewModel.getState());
    }
  };

  const handleCategorySelect = (category) => {
    viewModel.setSelectedNewsCategory(category.id);
    setState(viewModel.getState());
  };

  const handleRefresh = async () => {
    await viewModel.loadNews();
    setState(viewModel.getState());
  };

  const handleNewsPress = (article) => {
    console.log('News article pressed:', article.title);
  };

  const handleLike = (articleId) => {
    // Note: ViewModel doesn't manage likes; handle locally
    setState((prevState) => ({
      ...prevState,
      newsData: prevState.newsData.map((article) =>
        article.id === articleId
          ? { ...article, likes: article.likes + 1 }
          : article
      ),
    }));
  };

  const handleLearnMore = (article) => {
    console.log('Learn more pressed for:', article.title);
  };

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      console.warn('Navigation object is undefined');
    }
  };

  const handleNotification = () => {
    console.log('Notification pressed');
  };

  const handleSeeAllCategories = () => {
    console.log('See all categories pressed');
  };

  if (!navigation || !route) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error: Navigation context is missing
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (state.loading && state.newsData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Latest News"
          onBack={handleBack}
          onNotification={handleNotification}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading news...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <Header
        title="Latest News"
        onBack={handleBack}
        onNotification={handleNotification}
      />
      <SearchBar
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          clearTimeout(searchTimeout.current);
          searchTimeout.current = setTimeout(() => handleSearch(text), 500);
        }}
        placeholder="Search news"
      />
      <CategoriesSection
        categories={categories}
        selectedCategory={categories.find(
          (cat) => cat.id === state.selectedNewsCategory
        )}
        onCategorySelect={handleCategorySelect}
        onSeeAll={handleSeeAllCategories}
      />
      <FlatList
        data={state.newsData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NewsCard
            article={item}
            onPress={handleNewsPress}
            onLike={handleLike}
            onLearnMore={handleLearnMore}
          />
        )}
        style={styles.newsList}
        contentContainerStyle={styles.newsListContent}
        refreshing={state.loading}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No news articles found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  newsList: {
    flex: 1,
  },
  newsListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LatestNewsScreen;