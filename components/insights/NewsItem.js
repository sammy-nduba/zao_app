import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, fonts, colors } from '../../config/theme';

const NewsItem = ({ item }) => {
  return (
    <View style={styles.newsItem}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <View style={styles.newsMeta}>
        <Text style={styles.newsTime}>{item.time}</Text>
        <Text style={styles.newsStats}>{item.stats}</Text>
        <Text style={styles.newsSource}>{item.source}</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.large,
    marginVertical: spacing.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    ...fonts.subtitleBold,
    color: colors.text,
  },
  seeAll: {
    ...fonts.body,
    color: colors.primary,
  },
  newsTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.medium,
  },
  tab: {
    paddingBottom: spacing.small,
    marginRight: spacing.large,
  },
  tabText: {
    ...fonts.body,
    color: colors.textSecondary,
  },
  newsItem: {
    marginBottom: spacing.large,
  },
  newsTitle: {
    ...fonts.bodyBold,
    color: colors.text,
    marginBottom: spacing.small,
  },
  newsMeta: {
    flexDirection: 'row',
  },
  newsTime: {
    ...fonts.caption,
    color: colors.textSecondary,
    marginRight: spacing.medium,
  },
  newsStats: {
    ...fonts.caption,
    color: colors.textSecondary,
    marginRight: spacing.medium,
  },
  newsSource: {
    ...fonts.caption,
    color: colors.textSecondary,
  },
});

export default NewsItem;