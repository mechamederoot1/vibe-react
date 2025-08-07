import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';

import { Post } from '../types/content';
import { globalStyles } from '../styles/globalStyles';
import { colors, spacing, typography, borderRadius } from '../styles/theme';

interface PostCardProps {
  post: Post;
  currentUserId: number;
  onDelete: (postId: number) => void;
  onLike?: (postId: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onDelete,
  onLike,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      'Excluir Post',
      'Tem certeza que deseja excluir este post?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await onDelete(post.id);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o post');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    return date.toLocaleDateString('pt-BR');
  };

  const isOwner = post.author_id === currentUserId;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          {post.author_avatar ? (
            <Image source={{ uri: post.author_avatar }} style={globalStyles.avatar} />
          ) : (
            <View style={[globalStyles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {post.author_name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          )}
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{post.author_name}</Text>
            <Text style={styles.postTime}>{formatDate(post.created_at)}</Text>
          </View>
        </View>

        {isOwner && (
          <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuButton}>
            <Text style={styles.menuIcon}>⋮</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {post.post_type === 'testimonial' && (
          <View style={styles.testimonialBadge}>
            <Text style={styles.testimonialIcon}>❤️</Text>
            <Text style={styles.testimonialText}>Depoimento</Text>
          </View>
        )}
        
        <Text style={styles.postContent}>{post.content}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onLike?.(post.id)}>
          <Text style={styles.actionIcon}>❤️</Text>
          <Text style={styles.actionText}>Curtir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Comentar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>

      {/* Menu */}
      {showMenu && isOwner && (
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={deleting}
            style={styles.menuItem}
          >
            <Text style={styles.deleteText}>
              {deleting ? 'Excluindo...' : 'Excluir post'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay to close menu */}
      {showMenu && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  authorDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  authorName: {
    ...typography.h3,
    fontSize: 16,
  },
  postTime: {
    ...typography.caption,
    color: colors.textGray,
  },
  menuButton: {
    padding: spacing.sm,
  },
  menuIcon: {
    fontSize: 20,
    color: colors.textGray,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  testimonialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: spacing.sm,
  },
  testimonialIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  testimonialText: {
    ...typography.bodySmall,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  postContent: {
    ...typography.body,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  actionText: {
    ...typography.bodySmall,
    color: colors.textGray,
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    shadowColor: colors.shadowDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  menuItem: {
    padding: spacing.md,
    minWidth: 120,
  },
  deleteText: {
    ...typography.bodySmall,
    color: colors.error,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
});

export default PostCard;
