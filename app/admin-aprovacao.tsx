import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocalPendente {
  id: number;
  nome: string;
  endereco: string;
  foto?: string | null;
}

const API_URL = 'https://guia-santa-cruz-api.onrender.com';
const PRIMARY_BLUE = '#0027a6ff';

export default function AdminAprovacaoScreen() {
  const router = useRouter();
  const [data, setData] = useState<LocalPendente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchPendentes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/locais?status=pendente`);
      if (!res.ok) throw new Error('Falha ao buscar locais pendentes');
      const json = await res.json();
        console.log('admin-aprovacao - pendentes:', json);
        setData(Array.isArray(json) ? json : []);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível carregar os locais pendentes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPendentes();
    }, [fetchPendentes])
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchPendentes();
    } finally {
      setRefreshing(false);
    }
  }, [fetchPendentes]);

  const handleAprovar = useCallback(
    async (id: number, nome: string) => {
      try {
        setProcessingId(id);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro de Sessão', 'Você precisa estar logado para aprovar.');
          setProcessingId(null);
          return;
        }

        const res = await fetch(`${API_URL}/api/locais/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status_validacao: 'aprovado' }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Falha ao aprovar');
        }

        // Remove do estado local
        setData((prev) => prev.filter((item) => item.id !== id));
        Alert.alert('Sucesso', `"${nome}" foi aprovado!`);
      } catch (e: any) {
        console.error(e);
        Alert.alert('Erro', 'Não foi possível aprovar o local.');
      } finally {
        setProcessingId(null);
      }
    },
    []
  );

  const handleRejeitar = useCallback(
    async (id: number, nome: string) => {
      Alert.alert('Confirmar rejeição', `Tem certeza que deseja rejeitar "${nome}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rejeitar',
          style: 'destructive',
          onPress: async () => {
            try {
              setProcessingId(id);
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                Alert.alert('Erro de Sessão', 'Você precisa estar logado para rejeitar.');
                setProcessingId(null);
                return;
              }

              const res = await fetch(`${API_URL}/api/locais/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status_validacao: 'rejeitado' }),
              });

              if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Falha ao rejeitar');
              }

              // Remove do estado local
              setData((prev) => prev.filter((item) => item.id !== id));
              Alert.alert('Sucesso', `"${nome}" foi rejeitado.`);
            } catch (e: any) {
              console.error(e);
              Alert.alert('Erro', 'Não foi possível rejeitar o local.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]);
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: LocalPendente }) => {
      let imageSource = undefined;
      if (item.foto) {
        const foto = String(item.foto).trim();
        if (foto.startsWith('http')) {
          imageSource = { uri: foto };
        } else if (foto.startsWith('data:image')) {
          imageSource = { uri: foto };
        } else {
          imageSource = { uri: `data:image/jpeg;base64,${foto}` };
        }
      }

      const isProcessing = processingId === item.id;

      return (
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => router.push({ pathname: '/detalhes-local', params: { id: item.id } })}
              activeOpacity={0.7}
            >
              {imageSource ? (
                <Image source={imageSource} style={styles.thumbnail} resizeMode="cover" />
              ) : (
                <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                  <FontAwesome name="photo" size={16} color="#9aa0a6" />
                </View>
              )}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.nome}
                </Text>
                <Text style={styles.cardAddress} numberOfLines={2}>
                  {item.endereco}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleAprovar(item.id, item.nome)}
                disabled={isProcessing}
                activeOpacity={0.7}
              >
                <FontAwesome name="check" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Aprovar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleRejeitar(item.id, item.nome)}
                disabled={isProcessing}
                activeOpacity={0.7}
              >
                <FontAwesome name="times" size={18} color="#fff" />
                <Text style={styles.actionButtonText}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [handleAprovar, handleRejeitar, processingId]
  );

  const keyExtractor = useCallback((item: LocalPendente) => String(item.id), []);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="check-circle" size={64} color="#2e7d32" />
      <Text style={styles.emptyTitle}>Tudo limpo!</Text>
      <Text style={styles.emptyText}>Nada para aprovar hoje.</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
          <FontAwesome name="arrow-left" size={24} color={PRIMARY_BLUE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fila de Aprovação</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, data.length === 0 && { flex: 1 }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={ListEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0027a6ff' },
  listContent: { padding: 16 },
  separator: { height: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: { gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  thumbnail: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#e9ecef' },
  thumbnailPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 4 },
  cardAddress: { fontSize: 13, color: '#6b7280', lineHeight: 18 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  approveButton: { backgroundColor: '#2e7d32' },
  rejectButton: { backgroundColor: '#d32f2f' },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32', marginTop: 8 },
  emptyText: { fontSize: 16, color: '#9aa0a6' },
});
