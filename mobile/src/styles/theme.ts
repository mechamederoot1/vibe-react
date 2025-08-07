export const colors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#DBEAFE',
  
  secondary: '#6366F1',
  secondaryDark: '#4F46E5',
  secondaryLight: '#E0E7FF',
  
  background: '#FFFFFF',
  backgroundGray: '#F9FAFB',
  backgroundDark: '#111827',
  
  surface: '#FFFFFF',
  surfaceGray: '#F3F4F6',
  
  text: '#111827',
  textGray: '#6B7280',
  textLight: '#9CA3AF',
  
  white: '#FFFFFF',
  black: '#000000',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Instagram-like gradient colors
  gradientStart: '#833AB4',
  gradientMiddle: '#FD1D1D',
  gradientEnd: '#F77737',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.25)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};
