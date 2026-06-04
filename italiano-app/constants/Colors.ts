/**
 * Italian App Theme Colors
 * Inspired by the Italian flag: Verde, Bianco, Rosso.
 */

// Italian flag palette
const flagGreen  = '#008C45'; // Verde bandiera
const flagRed    = '#CD212A'; // Rosso bandiera
const italianGold = '#C9A227'; // Oro italiano (level badges, achievements)

export const Colors = {
  light: {
    text: '#1A1A1B',
    background: '#FFFFFF',
    tint: flagGreen,
    icon: '#4B5563',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: flagGreen,

    primary:   flagGreen,
    secondary: flagRed,
    accent:    italianGold,
    card:      '#FFFFFF',
    border:    '#E5E7EB',
    error:     flagRed,
    success:   flagGreen,
    muted:     '#6B7280',
    surface:   '#F9FAFB',

    // Semantic tokens for content types
    quiz:      flagGreen,      // Verde — esercizi quiz
    dialogue:  flagRed,        // Rosso — dialogo
    vocab:     italianGold,    // Oro — vocabolario

    // Tricolor stripe (used in header/tab decorations)
    triGreen:  flagGreen,
    triWhite:  '#D8D8D8',      // Visible on white background
    triRed:    flagRed,
  },
  dark: {
    text: '#FFFFFF',
    background: '#161616',
    tint: '#00C957',
    icon: '#ECECEC',
    tabIconDefault: '#888888',
    tabIconSelected: '#00C957',

    primary:   '#00C957',      // Verde brillante italiano
    secondary: '#FF3B3B',      // Rosso vivace italiano
    accent:    '#F4D03F',      // Oro per dark mode
    card:      '#222222',
    border:    '#3A3A3A',
    error:     '#FF3B3B',
    success:   '#00C957',
    muted:     '#9CA3AF',
    surface:   '#1A1A1A',

    quiz:      '#00C957',
    dialogue:  '#FF3B3B',
    vocab:     '#F4D03F',

    triGreen:  '#00C957',
    triWhite:  '#555555',
    triRed:    '#FF3B3B',
  },
};

export default Colors;
