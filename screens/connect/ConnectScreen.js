import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// UI Components
const Header = ({ onSearch, onMessage, onNotification, onProfile }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Zao Connect</Text>
    <View style={styles.headerActions}>
      <TouchableOpacity onPress={onSearch} style={styles.headerButton}>
        <Text style={styles.headerIcon}>🔍</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMessage} style={styles.headerButton}>
        <Text style={styles.headerIcon}>💬</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onNotification} style={styles.headerButton}>
        <Text style={styles.headerIcon}>🔔</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onProfile} style={styles.profileButton}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileText}>👤</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const StoryItem = ({ story, onPress }) => (
  <TouchableOpacity style={styles.storyItem} onPress={() => onPress(story)}>
    <View style={styles.storyImageContainer}>
      {story.isAddStory ? (
        <View style={styles.addStoryContainer}>
          <Text style={styles.addStoryIcon}>+</Text>
        </View>
      ) : (
        <View style={styles.storyImage}>
          <Text style={styles.storyEmoji}>{story.emoji}</Text>
        </View>
      )}
    </View>
    <Text style={styles.storyLabel}>{story.label}</Text>
  </TouchableOpacity>
);

const StoriesSection = ({ stories, onStoryPress }) => (
  <View style={styles.storiesSection}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
      {stories.map(story => (
        <StoryItem
          key={story.id}
          story={story}
          onPress={onStoryPress}
        />
      ))}
    </ScrollView>
  </View>
);

const FarmMapSection = ({ onMapPress }) => (
  <View style={styles.mapSection}>
    <Text style={styles.mapTitle}>Farm map</Text>
    <TouchableOpacity style={styles.mapContainer} onPress={onMapPress}>
      <View style={styles.mapBackground}>
        <View style={styles.mapMarker1}>
          <Text style={styles.markerText}>Mwangi</Text>
        </View>
        <View style={styles.mapMarker2}>
          <Text style={styles.markerText}>Njoroge</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

const PostCard = ({ post, onLike, onComment, onShare, onMore }) => (
  <View style={styles.postCard}>
    <View style={styles.postHeader}>
      <View style={styles.postUserInfo}>
        <View style={styles.postAvatar}>
          <Text style={styles.postAvatarText}>{post.avatar}</Text>
        </View>
        <View style={styles.postUserDetails}>
          <Text style={styles.postUserName}>{post.userName}</Text>
          <Text style={styles.postLocation}>{post.location}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onMore(post.id)} style={styles.moreButton}>
        <Text style={styles.moreIcon}>⋮</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.postContent}>{post.content}</Text>
    
    {post.hashtags && (
      <View style={styles.hashtagsContainer}>
        {post.hashtags.map((hashtag, index) => (
          <Text key={index} style={styles.hashtag}>{hashtag}</Text>
        ))}
      </View>
    )}
    
    <View style={styles.postImageContainer}>
      <View style={styles.postImage}>
        <Text style={styles.postImagePlaceholder}>{post.imageEmoji}</Text>
      </View>
      {post.hasAddButton && (
        <TouchableOpacity style={styles.addPhotoButton}>
          <Text style={styles.addPhotoIcon}>+</Text>
        </TouchableOpacity>
      )}
    </View>
    
    <View style={styles.postActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
        <Text style={styles.actionIcon}>👍</Text>
        <Text style={styles.actionText}>{post.likes}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
        <Text style={styles.actionIcon}>💬</Text>
        <Text style={styles.actionText}>{post.comments}</Text>
      </TouchableOpacity>
      <View style={styles.actionSpacer} />
      <Text style={styles.timeText}>{post.time}</Text>
      <TouchableOpacity style={styles.shareButton} onPress={() => onShare(post.id)}>
        <Text style={styles.shareIcon}>↗️</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'connect', label: 'Connect', icon: '🔗' },
    { id: 'learn', label: 'Learn', icon: '📚' },
    { id: 'home', label: '', icon: '🌱', isMain: true },
    { id: 'market', label: 'Market', icon: '🏪' },
    { id: 'ai', label: 'AI', icon: '🤖' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.bottomNavItem,
            tab.isMain && styles.mainBottomNavItem,
            activeTab === index && styles.activeBottomNavItem
          ]}
          onPress={() => onTabChange(index)}
        >
          {tab.isMain ? (
            <View style={styles.mainNavIcon}>
              <Text style={styles.mainNavIconText}>{tab.icon}</Text>
            </View>
          ) : (
            <>
              <Text style={[
                styles.bottomNavIcon,
                activeTab === index && styles.activeBottomNavIcon
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.bottomNavText,
                activeTab === index && styles.activeBottomNavText
              ]}>
                {tab.label}
              </Text>
            </>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main Screen Component
const ZaoConnectScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Mock stories data
      const storiesData = [
        { id: 1, label: 'Your story', emoji: '👤', isAddStory: true },
        { id: 2, label: 'Nyambura', emoji: '🥑' },
        { id: 3, label: 'Cliff', emoji: '🌰' },
        { id: 4, label: 'Mwangi', emoji: '👨‍🌾' },
      ];
      
      // Mock posts data
      const postsData = [
        {
          id: 1,
          userName: 'James Kinyanjui',
          location: 'Nairobi, Kenya',
          avatar: '👨‍🌾',
          content: 'Another day in the fields, nurturing dreams one crop at a time.',
          hashtags: ['#FarmLife', '#HarvestHope', '#FromSoilToTable'],
          imageEmoji: '🌾',
          likes: 300,
          comments: 32,
          time: '1d',
          hasAddButton: true,
        },
        {
          id: 2,
          userName: 'Agnes Atieno',
          location: 'Umuru, Kenya',
          avatar: '👩‍🌾',
          content: 'In the fields.',
          hashtags: [],
          imageEmoji: '🌿',
          likes: 200,
          comments: 32,
          time: '1d',
          hasAddButton: false,
        },
      ];
      
      setStories(storiesData);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryPress = (story) => {
    console.log('Story pressed:', story.label);
  };

  const handleMapPress = () => {
    console.log('Map pressed');
  };

  const handleLike = (postId) => {
    setPosts(posts =>
      posts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (postId) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId) => {
    console.log('Share post:', postId);
  };

  const handleMore = (postId) => {
    console.log('More options for post:', postId);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <Header
        onSearch={() => console.log('Search pressed')}
        onMessage={() => console.log('Message pressed')}
        onNotification={() => console.log('Notification pressed')}
        onProfile={() => console.log('Profile pressed')}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StoriesSection
          stories={stories}
          onStoryPress={handleStoryPress}
        />

        <FarmMapSection onMapPress={handleMapPress} />

        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onMore={handleMore}
          />
        ))}
      </ScrollView>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  headerIcon: {
    fontSize: 20,
  },
  profileButton: {
    marginLeft: 8,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 16,
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  storiesSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  storiesScroll: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 72,
  },
  storyImageContainer: {
    marginBottom: 8,
  },
  addStoryContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addStoryIcon: {
    fontSize: 24,
    color: '#666',
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  storyEmoji: {
    fontSize: 28,
  },
  storyLabel: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  mapSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  mapContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#8BC34A',
    position: 'relative',
  },
  mapMarker1: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mapMarker2: {
    position: 'absolute',
    top: 60,
    right: 30,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  postCard: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  postAvatarText: {
    fontSize: 20,
  },
  postUserDetails: {
    flex: 1,
  },
  postUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  postLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  moreIcon: {
    fontSize: 20,
    color: '#666',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  hashtag: {
    fontSize: 14,
    color: '#4CAF50',
    marginRight: 8,
  },
  postImageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  postImage: {
    flex: 1,
    backgroundColor: '#8BC34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postImagePlaceholder: {
    fontSize: 60,
  },
  addPhotoButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addPhotoIcon: {
    fontSize: 24,
    color: '#fff',
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 4,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  actionSpacer: {
    flex: 1,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    padding: 8,
    marginLeft: 12,
  },
  shareIcon: {
    fontSize: 16,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  mainBottomNavItem: {
    flex: 0,
  },
  mainNavIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  mainNavIconText: {
    fontSize: 24,
  },
  activeBottomNavItem: {
    // Add any active styling if needed
  },
  bottomNavIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  activeBottomNavIcon: {
    color: '#fff',
  },
  bottomNavText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeBottomNavText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ZaoConnectScreen;