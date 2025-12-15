import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter, Stack } from 'expo-router'; // <--- Adicionei o Stack aqui
import { FontAwesome } from '@expo/vector-icons';

// Types
interface LocalItem {
  id: number;
  nome: string;
  status_validacao: 'aprovado' | 'pendente' | string;
  endereco: string;
  foto?: string | null;
}

// ID 1 confirmado pelo Beekeeper
const USER_ID = 1;
const API_URL = 'https://guia-santa-cruz-api.onrender.com';

const MeusLocaisScreen: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<LocalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchLocais = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/locais/usuario/${USER_ID}`);
      if (!res.ok) throw new Error('Falha ao buscar os locais');
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocais();
  }, [fetchLocais]);

  useFocusEffect(
    useCallback(() => {
      fetchLocais();
    }, [fetchLocais])
  );

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchLocais();
    } finally {
      setRefreshing(false);
    }
  }, [fetchLocais]);

  const handleDelete = useCallback(
    (id: number) => {
      Alert.alert('Confirmação', 'Tem certeza que deseja excluir este local?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await fetch(`${API_URL}/api/locais/${id}`, { method: 'DELETE' });

              if (!res.ok) {
                 const text = await res.text();
                 throw new Error(text || 'Falha ao excluir');
              }

              setData((prev) => prev.filter((item) => item.id !== id));
              Alert.alert('Sucesso', 'Local removido!');
            } catch (e) {
              console.error(e);
              Alert.alert('Erro', 'Não foi possível excluir o local.');
            }
          },
        },
      ]);
    },
    []
  );

  const renderItem = useCallback(({ item }: { item: LocalItem }) => {
    let imageSource = undefined;

    if (item.foto) {
        const hasPrefix = item.foto.startsWith('data:image');
        const uri = hasPrefix ? item.foto : `data:image/jpeg;base64,${item.foto}`;
        imageSource = { uri };
    }

    const isApproved = String(item.status_validacao).toLowerCase() === 'aprovado';

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          {imageSource ? (
            <Image source={imageSource} style={styles.thumbnail} resizeMode="cover" />
          ) : (
            <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
              <FontAwesome name="photo" size={20} color="#9aa0a6" />
            </View>
          )}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.nome}
            </Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, isApproved ? styles.approved : styles.pending]} />
              <Text style={[styles.statusText, isApproved ? styles.approvedText : styles.pendingText]}>
                {isApproved ? 'Aprovado' : 'Pendente'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => handleDelete(item.id)}
            accessibilityLabel={`Excluir ${item.nome}`}
        >
          <FontAwesome name="trash" size={22} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    );
  }, [handleDelete]);

  const keyExtractor = useCallback((item: LocalItem) => String(item.id), []);

  const ListEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="map-o" size={42} color="#9aa0a6" />
      <Text style={styles.emptyText}>Nenhum local cadastrado</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
        {/* Essa linha esconde o cabeçalho padrão do Expo */}
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={{ padding: 10 }}>
                <FontAwesome name="arrow-left" size={24} color="#0027a6ff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Meus Locais</Text>
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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0027a6ff' },
  listContent: { padding: 16 },
  separator: { height: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, paddingRight: 12 },
  thumbnail: { width: 56, height: 56, borderRadius: 8, backgroundColor: '#e9ecef' },
  thumbnailPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  approved: { backgroundColor: '#2e7d32' },
  pending: { backgroundColor: '#ed6c02' },
  statusText: { fontSize: 13 },
  approvedText: { color: '#2e7d32' },
  pendingText: { color: '#ed6c02' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 16, color: '#9aa0a6', marginTop: 4 },
});

export default MeusLocaisScreen;
