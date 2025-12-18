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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

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
    image?: string;
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          <Image
            source={
              params.image
                ? { uri: params.image }
                : require('../../assets/images/MercadoChicoJulia.jpg')
            }
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.8}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content Panel with Modern Design */}
        <View style={styles.contentPanel}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={3}>
              {local.title}
            </Text>
          </View>

          {/* Address Info */}
          <View style={styles.addressRow}>
            <Ionicons name="location-sharp" size={18} color="#0027a6ff" />
            <Text style={styles.addressText}>{endereco}</Text>
          </View>

          {/* About Section */}
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>Sobre o local</Text>
            <Text style={styles.description}>{local.description}</Text>
          </View>

          {/* Ratings Section */}
          <View style={styles.ratingsSection}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            <View style={styles.ratingsContainer}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.ratingsText}>(Avaliações em breve)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroSection: {
    width: '100%',
    height: 280,
    backgroundColor: '#e5e7eb',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  contentPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0027a6ff',
    marginBottom: 14,
    lineHeight: 34,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    marginBottom: 24,
    gap: 10,
  },
  addressText: {
    fontSize: 15,
    color: '#666',
    flex: 1,
    lineHeight: 22,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#0027a6ff',
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 28,
    fontWeight: '400',
  },
  aboutSection: {
    marginBottom: 28,
  },
  ratingsSection: {
    marginTop: 28,
    paddingTop: 28,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  ratingsContainer: {
    alignItems: 'flex-start',
  },
  stars: {
    fontSize: 28,
    marginBottom: 8,
  },
  ratingsText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
});

