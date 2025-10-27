import { StyleSheet, Text, View } from 'react-native';

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text>Olá, Marvio! 🚀 Tela inicial funcionando!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
