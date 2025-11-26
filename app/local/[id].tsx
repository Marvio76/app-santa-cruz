import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Ponto {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  pinColor?: string;
}

export default function LocalDetalhesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    title?: string;
    description?: string;
    latitude?: string;
    longitude?: string;
    pinColor?: string;
  }>();

  // Converte os parâmetros para o tipo Ponto
  const local: Ponto = {
    title: params.title || 'Local',
    description: params.description || 'Descrição não disponível.',
    latitude: params.latitude ? parseFloat(params.latitude) : 0,
    longitude: params.longitude ? parseFloat(params.longitude) : 0,
    pinColor: params.pinColor,
  };

  // Gera um endereço mockado baseado nas coordenadas
  const endereco = `Santa Cruz dos Milagres, PI\nLat: ${local.latitude.toFixed(5)}, Long: ${local.longitude.toFixed(5)}`;

  return (
    <View style={styles.container}>
      {/* Imagem de Destaque */}
      <Image
        source={{ uri: 'https://source.unsplash.com/random/?hotel' }}
        style={styles.coverImage}
        resizeMode="cover"
      />

      {/* Botão Voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#0027a6ff" />
      </TouchableOpacity>

      {/* Conteúdo Scrollável */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título do Local */}
        <Text style={styles.titulo}>{local.title}</Text>

        {/* Endereço */}
        <View style={styles.enderecoContainer}>
          <Ionicons name="location-outline" size={20} color="#666" />
          <Text style={styles.endereco}>{endereco}</Text>
        </View>

        {/* Seção: Sobre o local */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Sobre o local</Text>
          <Text style={styles.descricao}>{local.description}</Text>
        </View>

        {/* Seção: Avaliações */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Avaliações</Text>
          <View style={styles.avaliacoesContainer}>
            <Text style={styles.estrelas}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.avaliacaoTexto}>
              (Avaliações em breve)
            </Text>
          </View>
        </View>

        {/* Espaço extra no final */}
        <View style={styles.espacoFinal} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0027a6ff',
    marginBottom: 15,
  },
  enderecoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  endereco: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 22,
  },
  secao: {
    marginBottom: 30,
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0027a6ff',
    marginBottom: 12,
  },
  descricao: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  avaliacoesContainer: {
    alignItems: 'flex-start',
  },
  estrelas: {
    fontSize: 28,
    marginBottom: 8,
  },
  avaliacaoTexto: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  espacoFinal: {
    height: 30,
  },
});

