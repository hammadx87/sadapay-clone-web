import { Text, TextProps, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export function ThemedText(props: TextProps) {
  const colorScheme = useColorScheme();
  const { style, ...otherProps } = props;

  return (
    <Text
      style={[
        {
          color: Colors[colorScheme ?? 'light'].text,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
