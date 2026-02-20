/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2196F3';
const tintColorDark = '#4dabf5';

export default {
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: tintColorLight,
    tabIconDefault: '#cccccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    tint: tintColorDark,
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
  },
} as const;
