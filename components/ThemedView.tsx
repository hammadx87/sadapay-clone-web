import { View, ViewProps, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export function ThemedView(props: ViewProps) {
  const colorScheme = useColorScheme();
  const { style, ...otherProps } = props;

  return (
    <View
      style={[
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
