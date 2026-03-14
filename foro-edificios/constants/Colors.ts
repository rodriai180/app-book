/**
 * Building Foro App Theme Colors
 * Urban and architectural theme focusing on stone, slate, and glass.
 */

const colors = {
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  
  teal600: '#0D9488',
  teal500: '#14B8A6',
  
  rose600: '#E11D48',
  
  white: '#FFFFFF',
};

export const Colors = {
  light: {
    text: colors.slate900,
    background: colors.white,
    tint: colors.teal600,
    icon: colors.slate500,
    tabIconDefault: colors.slate400,
    tabIconSelected: colors.teal600,
    
    primary: colors.teal600,
    secondary: colors.slate700,
    accent: colors.teal500,
    card: colors.white,
    border: colors.slate200,
    error: colors.rose600,
    success: colors.teal600,
    muted: colors.slate500,
    surface: colors.slate50,
  },
  dark: {
    text: colors.slate50,
    background: colors.slate900,
    tint: colors.teal500,
    icon: colors.slate400,
    tabIconDefault: colors.slate500,
    tabIconSelected: colors.teal500,
    
    primary: colors.teal500,
    secondary: colors.slate300,
    accent: colors.teal500,
    card: colors.slate800,
    border: colors.slate700,
    error: colors.rose600,
    success: colors.teal500,
    muted: colors.slate400,
    surface: colors.slate900,
  },
};

export default Colors;
