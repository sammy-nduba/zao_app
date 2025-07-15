import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';

const NewsCard = ({ article, onPress, onLike, onLearnMore }) => (
  <TouchableOpacity style={styles.newsCard} onPress={() => onPress(article)}>
    <Image
      source={{ uri: article.imageUrl }}
      style={styles.newsImage}
      resizeMode="cover"
    />
    <View style={styles.newsContent}>
      <Text style={styles.newsTitle} numberOfLines={2}>
        {article.title}
      </Text>
      <Text style={styles.newsTime}>{article.timeAgo}</Text>
      <View style={styles.newsFooter}>
        <View style={styles.newsMetadata}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => onLike(article.id)}
          >
            <Text style={styles.likeIcon}>❤️</Text>
            <Text style={styles.likeCount}>{article.likes}</Text>
          </TouchableOpacity>
          <Text style={styles.newsAuthor}>By {article.author}</Text>
          <Text style={styles.readTime}>{article.readTime}</Text>
        </View>
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={() => onLearnMore(article)}
        >
          <Text style={styles.learnMoreText}>Learn More →</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsImage: {
    width: '100%',
    height: 180,
  },
  newsContent: {
    padding: 16,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'column',
    gap: 12,
  },
  newsMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  likeCount: {
    fontSize: 12,
    color: '#666',
  },
  newsAuthor: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  readTime: {
    fontSize: 12,
    color: '#666',
  },
  learnMoreButton: {
    alignSelf: 'flex-end',
  },
  learnMoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default NewsCard;