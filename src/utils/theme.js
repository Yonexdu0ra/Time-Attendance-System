import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(210 11% 15%)',
    
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(210 11% 15%)',

    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(210 11% 15%)',

    /* X Blue */
    primary: 'hsl(203 89% 53%)',
    primaryForeground: 'hsl(0 0% 100%)',

    secondary: 'hsl(210 25% 96%)',
    secondaryForeground: 'hsl(210 11% 20%)',

    muted: 'hsl(210 25% 96%)',
    mutedForeground: 'hsl(210 10% 50%)',

    accent: 'hsl(203 89% 96%)',
    accentForeground: 'hsl(210 11% 15%)',

    destructive: 'hsl(355 78% 56%)',

    border: 'hsl(210 20% 90%)',
    input: 'hsl(210 20% 94%)',
    ring: 'hsl(203 89% 53%)',

    radius: '0.625rem',

    chart1: 'hsl(203 89% 53%)',
    chart2: 'hsl(174 60% 38%)',
    chart3: 'hsl(210 15% 25%)',
    chart4: 'hsl(42 90% 58%)',
    chart5: 'hsl(355 78% 56%)',
  },

  dark: {
    background: 'hsl(210 14% 4%)',
    foreground: 'hsl(210 12% 96%)',

    card: 'hsl(210 14% 6%)',
    cardForeground: 'hsl(210 12% 96%)',

    popover: 'hsl(210 14% 6%)',
    popoverForeground: 'hsl(210 12% 96%)',

    /* X Blue (dark) */
    primary: 'hsl(203 89% 64%)',
    primaryForeground: 'hsl(210 14% 4%)',

    secondary: 'hsl(210 10% 14%)',
    secondaryForeground: 'hsl(210 12% 92%)',

    muted: 'hsl(210 10% 14%)',
    mutedForeground: 'hsl(210 10% 60%)',

    accent: 'hsl(203 50% 14%)',
    accentForeground: 'hsl(210 12% 96%)',

    destructive: 'hsl(355 85% 60%)',

    border: 'hsl(210 10% 18%)',
    input: 'hsl(210 10% 16%)',
    ring: 'hsl(203 89% 64%)',

    radius: '0.625rem',

    chart1: 'hsl(203 89% 64%)',
    chart2: 'hsl(170 65% 44%)',
    chart3: 'hsl(210 10% 70%)',
    chart4: 'hsl(45 90% 60%)',
    chart5: 'hsl(355 85% 60%)',
  },
};

 
export const NAV_THEME = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};