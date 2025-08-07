import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, typography, borderRadius } from './theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    backgroundColor: colors.surface,
    marginVertical: spacing.sm,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  
  // Button styles
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.body.fontSize,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    color: colors.primary,
  },
  
  // Text styles
  h1: {
    ...typography.h1,
    color: colors.text,
  },
  h2: {
    ...typography.h2,
    color: colors.text,
  },
  h3: {
    ...typography.h3,
    color: colors.text,
  },
  body: {
    ...typography.body,
    color: colors.text,
  },
  bodySmall: {
    ...typography.bodySmall,
    color: colors.textGray,
  },
  caption: {
    ...typography.caption,
    color: colors.textLight,
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Spacing helpers
  marginVerticalSm: {
    marginVertical: spacing.sm,
  },
  marginVerticalMd: {
    marginVertical: spacing.md,
  },
  paddingHorizontalMd: {
    paddingHorizontal: spacing.md,
  },
  paddingVerticalMd: {
    paddingVertical: spacing.md,
  },
  
  // Avatar styles
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.surfaceGray,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  
  // Story styles
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
  },
  
  // Screen dimensions
  fullScreen: {
    width: screenWidth,
    height: screenHeight,
  },
});

export { screenWidth, screenHeight };
