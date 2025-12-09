import React from 'react';

import { Tabs } from 'expo-router';

import { FontAwesome } from '@expo/vector-icons'; // (Vamos usar ícones do FontAwesome)

// Função para renderizar o ícone (só pra deixar limpo)
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // <-- MATA o cabeçalho feio
        tabBarActiveTintColor: '#fff', // Cor do ícone ativo (branco)
        tabBarInactiveTintColor: '#aaa', // Cor do ícone inativo (cinza)
        tabBarStyle: {
          backgroundColor: '#0027a6ff', // <-- Fundo azul do protótipo
          borderTopWidth: 0, // Sem borda feia
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}>

      {/* Tab 1: O MAPA (index.tsx) */}
      <Tabs.Screen
        name="index" // <-- O mapa que a gente arrumou
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
        }}
      />

      {/* Tab 2: HISTÓRIA (historia.tsx) */}
      <Tabs.Screen
        name="historia" // <-- O arquivo historia.tsx
        options={{
          title: 'História',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />

      {/* Tab 3: PERFIL - Ícone de Pessoa */}
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />

    </Tabs>
  );
}

