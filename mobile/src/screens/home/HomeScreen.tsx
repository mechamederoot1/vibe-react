import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { useAuth } from '../../contexts/AuthContext';
import { Post, Story } from '../../types/content';
import { postService } from '../../services/postService';
import { storyService } from '../../services/storyService';
import PostCard from '../../components/PostCard';
import StoriesBar from '../../components/StoriesBar';
import AdvancedStoryCreator from '../../components/AdvancedStoryCreator';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing, typography } from '../../styles/theme';

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showStoryCreator, setShowStoryCreator] = useState(false);

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    try {
      setLoading(true);
      const [feedPosts, activeStories] = await Promise.all([
        postService.getFeed(),
        storyService.getActiveStories(),
      ]);

      setPosts(feedPosts);
      setStories(activeStories);
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
      Alert.alert('Erro', 'Não foi possível carregar o feed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFeedData();
    setRefreshing(false);
  }, []);

  const handleDeletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      Alert.alert('Erro', 'Não foi possível deletar o post');
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      await postService.likePost(postId);
      // Update post likes in UI if needed
    } catch (error) {
      console.error('Erro ao curtir post:', error);
    }
  };

  const handleCreateStory = () => {
    setShowStoryCreator(true);
  };

  const handleStorySubmit = async (content: string) => {
    try {
      const newStory = await storyService.createStory({ content });
      setStories([newStory, ...stories]);
    } catch (error) {
      console.error('Erro ao criar story:', error);
      Alert.alert('Erro', 'Não foi possível criar o story');
      throw error;
    }
  };

  const handleViewStory = (story: Story) => {
    // TODO: Navigate to story viewer
    Alert.alert('Em breve', 'Visualização de stories em desenvolvimento');
  };

  const handleCreatePost = () => {
    // TODO: Navigate to post creation screen
    Alert.alert('Em breve', 'Criação de posts em desenvolvimento');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      currentUserId={user?.id || 0}
      onDelete={handleDeletePost}
      onLike={handleLikePost}
    />
  );

  const renderHeader = () => (
    <View>
      {/* App Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Vibe</Text>
        <TouchableOpacity onPress={handleCreatePost} style={styles.createButton}>
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Stories */}
      <StoriesBar
        stories={stories}
        currentUser={user}
        onCreateStory={handleCreateStory}
        onViewStory={handleViewStory}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>👋</Text>
      <Text style={styles.emptyTitle}>Bem-vindo ao Vibe!</Text>
      <Text style={styles.emptyText}>
        Quando você começar a seguir pessoas, verá o conteúdo delas aqui.
      </Text>
      <TouchableOpacity onPress={handleCreatePost} style={styles.emptyButton}>
        <Text style={styles.emptyButtonText}>Criar sua primeira publicação</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (posts.length === 0) return null;
    
    return (
      <View style={styles.footer}>
        <Text style={styles.footerIcon}>🎉</Text>
        <Text style={styles.footerText}>Você chegou ao fim!</Text>
        <Text style={styles.footerSubtext}>Siga mais pessoas para ver mais posts.</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.centerContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        style={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  appTitle: {
    ...typography.h2,
    color: colors.primary,
    fontWeight: 'bold',
  },
  createButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingText: {
    ...typography.body,
    color: colors.textGray,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  emptyButton: {
    ...globalStyles.button,
    paddingHorizontal: spacing.lg,
  },
  emptyButtonText: {
    ...globalStyles.buttonText,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
  },
  footerIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  footerText: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textGray,
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default HomeScreen;
