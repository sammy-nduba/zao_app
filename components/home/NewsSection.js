// src/components/home/NewsSection.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../config/theme';

const NewsSection = ({ newsData, selectedCategory, onCategoryChange }) => {
  const navigation = useNavigation();
  console.log('NewsSection.js newsData:', newsData); // Debug

  const categories = ['Kenya', 'Africa', 'Global'];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.newsArticle}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.newsImage}
        resizeMode="cover"
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsArticleTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.newsArticleMeta}>
          <Text style={styles.newsTime}>1hr</Text>
          <View style={styles.newsStats}>
            <Text style={styles.newsLikes}>❤️ {item.likes / 1000}k</Text>
            <Text style={styles.newsAuthor}>By {item.author}</Text>
            <Text style={styles.newsReadTime}>{item.readTime}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.learnMore}>
          <Text style={styles.learnMoreText}>Learn More →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.newsTitle}>Latest News</Text>
      <View style={styles.newsTabs}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.newsTab,
              selectedCategory === category.toLowerCase() && styles.newsTabActive,
            ]}
            onPress={() => onCategoryChange(category.toLowerCase())}
          >
            <Text
              style={[
                styles.newsTabText,
                selectedCategory === category.toLowerCase() && styles.newsTabTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={newsData.slice(0, 3)} // Limit to 2 articles
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        style={styles.newsList}
        nestedScrollEnabled // Enable independent scrolling
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={styles.noDataText}>No news available</Text>
        )}
        contentContainerStyle={styles.newsListContent}
      />
      {/* <TouchableOpacity
        style={styles.seeAllButton}
        onPress={() => navigation.navigate('LatestNewsScreen', { category: selectedCategory })}
      >
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 20,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.grey[600],
    marginBottom: 15,
  },
  newsTabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  newsTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  newsTabActive: {
    borderBottomColor: colors.primary[500],
  },
  newsTabText: {
    fontSize: 14,
    color: colors.grey[500],
  },
  newsTabTextActive: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  newsList: {
    maxHeight: 400, // Adjust height for 2 articles
  },
  newsListContent: {
    paddingBottom: 16,
  },
  newsArticle: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  newsImage: {
    width: 340,
    height: 174,
    borderRadius: 8,
    marginTop: 8,
  },
  newsContent: {
    width: 340,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  newsArticleTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.grey[900],
    marginBottom: 8,
    lineHeight: 20,
  },
  newsArticleMeta: {
    marginBottom: 8,
  },
  newsTime: {
    fontSize: 12,
    color: colors.grey[500],
    marginBottom: 4,
  },
  newsStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newsLikes: {
    fontSize: 12,
    color: colors.grey[500],
  },
  newsAuthor: {
    fontSize: 12,
    color: colors.grey[500],
  },
  newsReadTime: {
    fontSize: 12,
    color: colors.grey[500],
  },
  learnMore: {
    alignSelf: 'flex-end',
  },
  learnMoreText: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
  },
  // seeAllButton: {
  //   alignItems: 'center',
  //   paddingVertical: 15,
  // },
  // seeAllText: {
  //   fontSize: 16,
  //   color: '#4CAF50',
  //   fontWeight: '600',
  //   alignContent: 'flex-end'
  // },
  noDataText: {
    fontSize: 14,
    color: colors.grey[500],
    textAlign: 'center',
    padding: 16,
  },
});

export default NewsSection;