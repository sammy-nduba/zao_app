// components/NewsSection/NewsSection.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import NewsItem from './NewsItem';
import { spacing, colors, fonts } from '../../config/theme';

const NewsSection = ({ news }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Latest News</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Learn More → See All</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.newsTabs}>
        {['Kenya', 'Africa', 'Global'].map((tab) => (
          <TouchableOpacity key={tab} style={styles.tab}>
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={news}
        renderItem={({ item }) => <NewsItem item={item} />}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
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

export default NewsSection;

