import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';

import { Story } from '../types/content';
import { User } from '../types/auth';
import { globalStyles } from '../styles/globalStyles';
import { colors, spacing, typography } from '../styles/theme';

interface StoriesBarProps {
  stories: Story[];
  currentUser: User | null;
  onCreateStory: () => void;
  onViewStory: (story: Story) => void;
}

const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onCreateStory,
  onViewStory,
}) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours < 24) return `${diffInHours}h`;
    return '1d';
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {/* Create Story Button */}
        <TouchableOpacity onPress={onCreateStory} style={styles.storyItem}>
          <View style={styles.createStoryRing}>
            {currentUser?.avatar_url ? (
              <Image source={{ uri: currentUser.avatar_url }} style={globalStyles.storyImage} />
            ) : (
              <View style={[globalStyles.storyImage, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.addIcon}>
              <Text style={styles.addIconText}>+</Text>
            </View>
          </View>
          <Text style={styles.storyLabel}>Seu story</Text>
        </TouchableOpacity>

        {/* Stories */}
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            onPress={() => onViewStory(story)}
            style={styles.storyItem}
          >
            <View style={globalStyles.storyRing}>
              {story.author_avatar ? (
                <Image source={{ uri: story.author_avatar }} style={globalStyles.storyImage} />
              ) : (
                <View style={[globalStyles.storyImage, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>
                    {story.author_name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.storyLabel} numberOfLines={1}>
              {story.author_name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Empty state */}
        {stories.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum story ainda</Text>
            <Text style={styles.emptySubtext}>Seja o primeiro a compartilhar!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  scrollView: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    width: 70,
  },
  createStoryRing: {
    position: 'relative',
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  addIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  addIconText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  storyLabel: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
    width: 70,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textGray,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default StoriesBar;
