import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // <--- A MÁGICA: Isso esconde o cabeçalho de TUDO (login, tabs, meus-locais...)
        contentStyle: { backgroundColor: '#f3f4f6' } // (Opcional) Já deixa o fundo cinzinha padrão em tudo
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      {/* Não precisa nem listar 'meus-locais' aqui, ele já pega a regra do pai automático! */}
    </Stack>
  );
}
