import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';

import { useAuth } from '../../contexts/AuthContext';
import { Post } from '../../types/content';
import { postService } from '../../services/postService';
import PostCard from '../../components/PostCard';
import { globalStyles } from '../../styles/globalStyles';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  useEffect(() => {
    if (user) {
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userPosts = await postService.getUserPosts(user.id);
      setPosts(userPosts);
    } catch (error) {
      console.error('Erro ao carregar posts do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Erro ao deletar post:', error);
      Alert.alert('Erro', 'Não foi possível deletar o post');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Em breve', 'Edição de perfil em desenvolvimento');
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      currentUserId={user?.id || 0}
      onDelete={handleDeletePost}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Cover Photo */}
      <View style={styles.coverPhoto}>
        {user?.cover_photo_url ? (
          <Image source={{ uri: user.cover_photo_url }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.profileAvatar} />
          ) : (
            <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* User Details */}
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          {user?.bio && (
            <Text style={styles.userBio}>{user.bio}</Text>
          )}
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Seguindo</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            ✏️ Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'about' && styles.activeTab]}
          onPress={() => setActiveTab('about')}
        >
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
            ℹ️ Sobre
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAboutTab = () => (
    <View style={styles.aboutTab}>
      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Membro desde</Text>
        <Text style={styles.aboutValue}>
          {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
        </Text>
      </View>
      {user?.username && (
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>Nome de usuário</Text>
          <Text style={styles.aboutValue}>@{user.username}</Text>
        </View>
      )}
      <View style={styles.aboutItem}>
        <Text style={styles.aboutLabel}>Status</Text>
        <Text style={styles.aboutValue}>
          {user?.is_verified ? '✅ Verificado' : '👤 Usuário'}
        </Text>
      </View>
    </View>
  );

  const renderEmptyPosts = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>Nenhum post ainda</Text>
      <Text style={styles.emptyText}>
        Compartilhe seus pensamentos com o mundo!
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.centerContainer}>
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {activeTab === 'posts' ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyPosts}
          style={styles.container}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView style={styles.container}>
          {renderHeader()}
          {renderAboutTab()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  header: {
    backgroundColor: colors.surface,
  },
  coverPhoto: {
    height: 120,
    backgroundColor: colors.primaryLight,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
  },
  profileInfo: {
    padding: spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: spacing.md,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userName: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  userBio: {
    ...typography.body,
    color: colors.textGray,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  editButton: {
    ...globalStyles.button,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  editButtonText: {
    ...globalStyles.buttonText,
  },
  logoutButton: {
    ...globalStyles.button,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.error,
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  logoutButtonText: {
    ...globalStyles.buttonText,
    color: colors.error,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textGray,
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textGray,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
  },
  aboutTab: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  aboutLabel: {
    ...typography.bodySmall,
    color: colors.textGray,
  },
  aboutValue: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
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
    margin: spacing.md,
    borderRadius: borderRadius.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textGray,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default ProfileScreen;
