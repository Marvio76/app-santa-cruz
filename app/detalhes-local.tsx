import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface LocalDetalhe {
  id: number;
  nome: string;
  status_validacao: 'aprovado' | 'pendente' | string;
  endereco: string;
  descricao?: string | null;
  foto?: string | null;
}

const API_URL = 'https://guia-santa-cruz-api.onrender.com';
const PRIMARY_BLUE = '#0027a6ff';

// Helper function to check if status is approved (case-insensitive)
const isStatusApproved = (status: string | undefined): boolean => {
  return String(status || '').toLowerCase().trim() === 'aprovado';
};

export default function DetalhesLocalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = useMemo(() => {
    const raw = params?.id;
    if (Array.isArray(raw)) return raw[0];
    return raw as string | undefined;
  }, [params]);

  const [data, setData] = useState<LocalDetalhe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetalhe = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/locais/${id}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Falha ao buscar o local');
        }
        const json = await res.json();
        setData(json || null);
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhe();
  }, [id]);

  const imageSource = useMemo(() => {
    if (!data?.foto) return undefined;
    const hasPrefix = data.foto.startsWith('data:image');
    const uri = hasPrefix ? data.foto : `data:image/jpeg;base64,${data.foto}`;
    return { uri } as const;
  }, [data?.foto]);

  const isApproved = useMemo(() => isStatusApproved(data?.status_validacao), [data?.status_validacao]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroSection}>
          {imageSource ? (
            <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons name="image-outline" size={80} color="#d1d5db" />
            </View>
          )}

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
          {/* Title and Badge Row */}
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={3}>
              {data?.nome || 'Local'}
            </Text>
            {!!data && (
              <View style={[styles.badge, isApproved ? styles.badgeApproved : styles.badgePending]}>
                <Text style={[styles.badgeText, isApproved ? styles.badgeApprovedText : styles.badgePendingText]}>
                  {isApproved ? '✓ Aprovado' : '⏳ Pendente'}
                </Text>
              </View>
            )}
          </View>

          {/* Address Info */}
          {data?.endereco ? (
            <View style={styles.infoCard}>
              <Ionicons name="location-sharp" size={20} color={PRIMARY_BLUE} />
              <Text style={styles.infoText}>{data.endereco}</Text>
            </View>
          ) : null}

          {/* Loading State */}
          {loading && (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color={PRIMARY_BLUE} />
              <Text style={styles.stateText}>Carregando informações...</Text>
            </View>
          )}

          {/* Error State */}
          {error && !loading && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={24} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* About Section */}
          {data?.descricao && !loading && (
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>Sobre o local</Text>
              <Text style={styles.description}>{data.descricao}</Text>
            </View>
          )}
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
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
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
    color: '#111827',
    marginBottom: 14,
    lineHeight: 34,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeApproved: {
    backgroundColor: '#dcfce7',
  },
  badgePending: {
    backgroundColor: '#fed7aa',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeApprovedText: {
    color: '#166534',
  },
  badgePendingText: {
    color: '#92400e',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 20,
    gap: 14,
  },
  infoText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
    lineHeight: 24,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 14,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 28,
    fontWeight: '400',
  },
  aboutSection: {
    marginTop: 28,
    paddingTop: 28,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  stateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 14,
  },
  stateText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 12,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '600',
    flex: 1,
  },
});
