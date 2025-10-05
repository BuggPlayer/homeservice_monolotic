/**
 * Design Tokens - Centralized design values
 * 
 * All design values should be defined here to ensure consistency
 * across the application.
 */

// Spacing Scale (8px base unit)
export const spacing = {
  xs: 4,    // 0.5rem
  sm: 8,    // 1rem
  md: 16,   // 2rem
  lg: 24,   // 3rem
  xl: 32,   // 4rem
  xxl: 48,  // 6rem
} as const

// Border Radius Scale
export const borderRadius = {
  xs: 4,    // Small elements
  sm: 6,    // Buttons, chips
  md: 8,    // Cards, inputs (default)
  lg: 12,   // Large cards
  xl: 16,   // Modals, dialogs
  full: 9999, // Pills, avatars
} as const

// Shadow Scale
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const

// Typography Scale
export const typography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const

// Component Sizes
export const sizes = {
  button: {
    sm: {
      height: 32,
      padding: '6px 12px',
      fontSize: typography.fontSize.sm,
    },
    md: {
      height: 40,
      padding: '8px 16px',
      fontSize: typography.fontSize.sm,
    },
    lg: {
      height: 48,
      padding: '12px 24px',
      fontSize: typography.fontSize.base,
    },
  },
  
  input: {
    sm: {
      height: 32,
      padding: '6px 12px',
    },
    md: {
      height: 40,
      padding: '8px 12px',
    },
    lg: {
      height: 48,
      padding: '12px 16px',
    },
  },
  
  card: {
    padding: {
      sm: spacing.sm,
      md: spacing.md,
      lg: spacing.lg,
    },
  },
} as const

// Animation Durations
export const transitions = {
  fast: '150ms',
  normal: '250ms',
  slow: '350ms',
} as const

// Z-Index Scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const

// Breakpoints (matching MUI)
export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const

// Status Colors
export const statusColors = {
  success: {
    main: '#059669',
    light: '#10b981',
    dark: '#047857',
    contrastText: '#ffffff',
  },
  error: {
    main: '#dc2626',
    light: '#ef4444',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#d97706',
    light: '#f59e0b',
    dark: '#b45309',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0891b2',
    light: '#06b6d4',
    dark: '#0e7490',
    contrastText: '#ffffff',
  },
} as const

// Common Component Props
export const commonProps = {
  button: {
    textTransform: 'none' as const,
    fontWeight: typography.fontWeight.semibold,
    borderRadius: borderRadius.md,
  },
  
  card: {
    borderRadius: borderRadius.lg,
    boxShadow: shadows.md,
    transition: `box-shadow ${transitions.normal} ease-in-out`,
  },
  
  input: {
    borderRadius: borderRadius.md,
    '&:focus': {
      boxShadow: `0 0 0 3px rgba(37, 99, 235, 0.1)`,
    },
  },
} as const
