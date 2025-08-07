import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

import { User } from '../types/auth';
import { colors, spacing, typography, borderRadius } from '../styles/theme';
import { globalStyles, screenWidth } from '../styles/globalStyles';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, postType: string) => Promise<void>;
  currentUser: User | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onSubmit,
  currentUser,
}) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('text');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Erro', 'Digite algo para compartilhar');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(content.trim(), postType);
      setContent('');
      setPostType('text');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar post');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setPostType('text');
    onClose();
  };

  const maxLength = postType === 'testimonial' ? 1000 : 2200;
  const remainingChars = maxLength - content.length;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Nova Publicação</Text>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!content.trim() || loading}
            style={[styles.publishButton, (!content.trim() || loading) && styles.publishButtonDisabled]}
          >
            <Text style={[styles.publishText, (!content.trim() || loading) && styles.publishTextDisabled]}>
              {loading ? 'Publicando...' : 'Compartilhar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* User Info */}
          <View style={styles.userInfo}>
            {currentUser?.avatar_url ? (
              <Image source={{ uri: currentUser.avatar_url }} style={globalStyles.avatar} />
            ) : (
              <View style={[globalStyles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}
                </Text>
              </View>
            )}
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {currentUser?.first_name} {currentUser?.last_name}
              </Text>
            </View>
          </View>

          {/* Post Type Selector */}
          <View style={styles.typeSelector}>
            <TouchableOpacity
              onPress={() => setPostType('text')}
              style={[styles.typeButton, postType === 'text' && styles.typeButtonActive]}
            >
              <Text style={styles.typeIcon}>✏️</Text>
              <Text style={[styles.typeText, postType === 'text' && styles.typeTextActive]}>
                Post
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setPostType('testimonial')}
              style={[styles.typeButton, postType === 'testimonial' && styles.typeButtonActive]}
            >
              <Text style={styles.typeIcon}>❤️</Text>
              <Text style={[styles.typeText, postType === 'testimonial' && styles.typeTextActive]}>
                Depoimento
              </Text>
            </TouchableOpacity>
          </View>

          {/* Text Input */}
          <View style={styles.inputContainer}>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder={
                postType === 'testimonial'
                  ? 'Escreva um depoimento especial para alguém...'
                  : 'O que você está pensando?'
              }
              placeholderTextColor={colors.textLight}
              style={styles.textInput}
              multiline
              textAlignVertical="top"
              maxLength={maxLength}
              autoFocus
            />
            
            <View style={styles.inputFooter}>
              <Text style={[styles.charCount, remainingChars < 50 && styles.charCountWarning]}>
                {remainingChars} caracteres restantes
              </Text>
            </View>
          </View>

          {/* Testimonial Info */}
          {postType === 'testimonial' && (
            <View style={styles.testimonialInfo}>
              <View style={styles.testimonialHeader}>
                <Text style={styles.testimonialIcon}>❤️</Text>
                <Text style={styles.testimonialTitle}>Depoimento</Text>
              </View>
              <Text style={styles.testimonialDescription}>
                Depoimentos são uma forma especial de demonstrar carinho e reconhecimento. 
                Seja autêntico e positivo!
              </Text>
            </View>
          )}

          {/* Future Features */}
          <View style={styles.futureFeatures}>
            <Text style={styles.featuresTitle}>Em breve:</Text>
            
            <TouchableOpacity style={styles.featureButton} disabled>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>📷</Text>
              </View>
              <Text style={styles.featureText}>Adicionar foto/vídeo</Text>
              <Text style={styles.featureComingSoon}>Em breve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.featureButton} disabled>
              <View style={styles.featureIcon}>
                <Text style={styles.featureIconText}>📍</Text>
              </View>
              <Text style={styles.featureText}>Adicionar localização</Text>
              <Text style={styles.featureComingSoon}>Em breve</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  cancelButton: {
    padding: spacing.sm,
  },
  cancelText: {
    ...typography.body,
    color: colors.textGray,
  },
  title: {
    ...typography.h3,
    fontSize: 18,
  },
  publishButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  publishButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  publishText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  publishTextDisabled: {
    color: colors.textGray,
  },
  content: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
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
  userDetails: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  userName: {
    ...typography.h3,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  typeButtonActive: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  typeText: {
    ...typography.bodySmall,
    color: colors.textGray,
    fontWeight: '500',
  },
  typeTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  textInput: {
    ...typography.body,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  charCount: {
    ...typography.caption,
    color: colors.textLight,
  },
  charCountWarning: {
    color: colors.error,
  },
  testimonialInfo: {
    backgroundColor: colors.primaryLight,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  testimonialIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  testimonialTitle: {
    ...typography.bodySmall,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  testimonialDescription: {
    ...typography.bodySmall,
    color: colors.primaryDark,
    lineHeight: 20,
  },
  futureFeatures: {
    margin: spacing.md,
  },
  featuresTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.md,
    color: colors.textGray,
  },
  featureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  featureIconText: {
    fontSize: 14,
  },
  featureText: {
    ...typography.bodySmall,
    flex: 1,
    color: colors.textGray,
  },
  featureComingSoon: {
    ...typography.caption,
    color: colors.textLight,
  },
});

export default CreatePostModal;
