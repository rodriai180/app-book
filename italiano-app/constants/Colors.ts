/**
 * Italian App Theme Colors
 * Inspired by the Italian flag but softened for a modern, premium feel.
 */

const primaryGreen = '#008C45'; // Flag Green
const primaryWhite = '#F4F9FF'; // Soft Cloud White
const primaryRed = '#CD212A';   // Flag Red

export const Colors = {
  light: {
    text: '#1A1A1B',
    background: '#FFFFFF',
    tint: primaryGreen,
    icon: '#4B5563',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primaryGreen,
    
    // Custom Brand Colors
    primary: primaryGreen,
    secondary: primaryRed,
    accent: '#FFD700', // Gold for levels/achievements
    card: '#FFFFFF',
    border: '#E5E7EB',
    error: primaryRed,
    success: primaryGreen,
    muted: '#6B7280',
    surface: '#F9FAFB',
  },
  dark: {
    text: '#FFFFFF',
    background: '#151718',
    tint: '#34D399',
    icon: '#FFFFFF',
    tabIconDefault: '#FFFFFF',
    tabIconSelected: '#34D399',
    
    primary: '#34D399',
    secondary: '#F87171',
    accent: '#FBBF24',
    card: '#1E1E1E',
    border: '#374151',
    error: '#F87171',
    success: '#34D399',
    muted: '#9CA3AF',
    surface: '#111827',
  },
};

export default Colors;
