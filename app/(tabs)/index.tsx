import React, { useState, useMemo, useCallback } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    RefreshControl, // Importante para puxar pra baixo e atualizar
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import MapComponent from '../../components/MapComponent';
import axios from 'axios';

// Admin password
const ADMIN_PASSWORD = '1234';

// Coordenadas padrão (Centro de Santa Cruz) para fallback caso venha zerado
const DEFAULT_LAT = -5.80395;
const DEFAULT_LONG = -41.95365;

// Tipagem mínima para dados vindos da API
interface APILocal {
    id?: number;
    nome?: string;
    title?: string;
    description?: string;
    latitude?: number | string;
    longitude?: number | string;
    foto?: string | null;
    imagem?: string | null;
    image?: string | null;
    status_validacao?: string | null;
    [key: string]: any;
}

export default function Index() {
    const router = useRouter();

    // <-- MEMÓRIA DO FILTRO: null = mostrar tudo
    const [filtroAtivo, setFiltroAtivo] = useState(null);

    // <-- ESTADO DA BARRA DE BUSCA
    const [textoBusca, setTextoBusca] = useState('');

    // <-- ESTADO DA VISUALIZAÇÃO: false = mapa, true = lista
    const [visualizacaoLista, setVisualizacaoLista] = useState(false);

    // <-- ESTADO DO REFRESH (PUXAR PRA BAIXO)
    const [refreshing, setRefreshing] = useState(false);

    // <-- ESTADO DO MODAL DE ADMIN
    const [adminModalVisible, setAdminModalVisible] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    // 📍 Lista de pontos estáticos
    const PONTOS_ESTATICOS = [
        {
            title: 'Comercio Fernandes',
            description: 'Um comércio local conhecido pelo bom atendimento e variedade de produtos da região.',
            latitude: -5.80722,
            longitude: -41.95426,
            pinColor: 'orange',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768257580/Fernandes_yvucw3.jpg',
        },
        {
            title: 'Comercio Santa Cruz',
            description: 'Frutaria com frutas sempre frescas e selecionadas, direto dos produtores locais.',
            latitude: -5.80395,
            longitude: -41.95365,
            pinColor: 'green',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768257453/decasa_qiyo7b.jpg',
        },
        {
            title: 'Comercio Santa Luzia',
            description: 'Espaço agradável com grande variedade de frutas, verduras e produtos naturais.',
            latitude: -5.79952,
            longitude: -41.95657,
            pinColor: 'green',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768256886/Santa-luzia_eskgyw.jpg',
        },
        {
            title: 'Comercio Oliveira',
            description: 'Frutaria bem localizada, com excelente qualidade e preços acessíveis.',
            latitude: -5.80339,
            longitude: -41.96101,
            pinColor: 'green',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768256678/mercado-oliveira_vg4ttz.jpg',
        },
        {
            title: 'Olho a Agua',
            description: 'Ponto natural muito visitado, com nascente de água limpa e paisagem tranquila.',
            latitude: -5.79965,
            longitude: -41.95587,
            pinColor: 'blue',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768257680/olho-d-agua_eabzkf.jpg',
        },
        {
            title: 'Mercearia Alves',
            description: 'Loja tradicional com produtos variados e ótimo atendimento aos moradores locais.',
            latitude: -5.80292,
            longitude: -41.9615,
            pinColor: 'orange',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768257311/Mercearia-Alves_osmskr.jpg',
        },
        {
            title: 'Supermercado Soares',
            description: 'Frutaria familiar com atendimento simpático e produtos de excelente qualidade.',
            latitude: -5.80067,
            longitude: -41.95818,
            pinColor: 'green',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768255407/supermercado_Soares_r7wudm.jpg',
        },
        {
            title: 'Comercio Chico julia',
            description: 'Local acolhedor com frutas fresquinhas e ambiente limpo e organizado.',
            latitude: -5.80315,
            longitude: -41.95365,
            pinColor: 'green',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768256111/mercado-Chico-Julia_v1avtl.png',
        },
        {
            title: 'Comercio Ze Omano',
            description: 'Comércio com boa reputação, variedade de produtos e preços justos.',
            latitude: -5.80355,
            longitude: -41.95297,
            pinColor: 'orange',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768257776/omano_e2cmni.jpg',
        },
        {
            title: 'Academia FitLife',
            description: 'Localizada no 1º andar (em cima do comércio). Academia moderna e bem equipada, ideal para quem busca saúde e bem-estar.',
            latitude: -5.79944,
            longitude: -41.95658,
            pinColor: 'purple',
            image: 'https://res.cloudinary.com/dif50qjgs/image/upload/v1768256886/Santa-luzia_eskgyw.jpg',
        },
        {
            title: 'Lava-jato Gustavo',
            description: 'Lava-jato com excelente reputação, oferecendo limpeza completa e detalhada.',
            latitude: -5.80701,
            longitude: -41.96138,
            pinColor: 'cyan',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        },
        {
            title: 'Pousada Ailton',
            description: 'Pousada acolhedora com ótimo conforto e atendimento, ideal para visitantes da cidade.',
            latitude: -5.81472,
            longitude: -41.95459,
            pinColor: 'pink',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        },
    ];

    // Estado que conterá estáticos + API
    const [locais, setLocais] = useState(PONTOS_ESTATICOS);

    // Helper para normalizar URIs de imagem
    const getImageUri = (fotoOrImage?: any) => {
        if (!fotoOrImage) return undefined;
        const s = String(fotoOrImage).trim();
        if (s.startsWith('http')) return s;
        if (s.startsWith('data:image')) return s;
        return `data:image/jpeg;base64,${s}`;
    };

    // Buscar locais da API e combinar
    const fetchLocais = useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await axios.get('https://guia-santa-cruz-api.onrender.com/api/locais');
            const apiData: APILocal[] = Array.isArray(response.data) ? response.data : [];
            console.log('Locais da API recebidos:', apiData.length);
            
            // Padroniza campos vindos da API
            const normalizados = apiData
                .map((item) => {
                    // CORREÇÃO: Tenta pegar o nome de 'title' ou 'nome'
                    const title = item.title || item.nome || 'Local Sem Nome';
                    
                    // CORREÇÃO: Tenta pegar descrição de VÁRIOS campos (inclusive endereço se faltar descrição)
                    const description = item.descricao || item.description || item.sobre || item.endereco || 'Toque para ver detalhes...';
                    
                    // CORREÇÃO: Tratamento robusto para Latitude/Longitude
                    // Converte para string primeiro, garante ponto no lugar de vírgula, depois parseFloat
                    let latitude = parseFloat(String(item.latitude || '').replace(',', '.'));
                    let longitude = parseFloat(String(item.longitude || '').replace(',', '.'));
                    
                    // Se a coordenada vier inválida (NaN) ou zerada, usa o fallback para o local não sumir
                    if (Number.isNaN(latitude) || latitude === 0) {
                        // console.warn(`Local ${title} sem latitude válida.`); // Silenciado para limpar o log
                        latitude = DEFAULT_LAT;
                    }
                    if (Number.isNaN(longitude) || longitude === 0) {
                        longitude = DEFAULT_LONG;
                    }

                    const foto = item.foto || item.imagem || item.image || undefined;
                    const imageRaw = item.image || item.imagem || foto || undefined;
                    const image = getImageUri(imageRaw) || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80';

                    // Retorna o objeto formatado
                    return {
                        title,
                        description,
                        latitude,
                        longitude,
                        foto,
                        image,
                        status_validacao: item.status_validacao,
                        pinColor: 'orange', // Cor padrão para novos locais
                    };
                });

            // Junta tudo: Estáticos primeiro, depois os da API
            const listaCombinada = [...PONTOS_ESTATICOS, ...normalizados];
            setLocais(listaCombinada);
        } catch (e) {
            console.error("Erro ao buscar locais:", e);
            // Em caso de erro, mantém pelo menos os estáticos
            setLocais(PONTOS_ESTATICOS);
        } finally {
            setRefreshing(false);
        }
    }, []);

    // Chama quando a tela ganha foco (volta do Admin ou outra tela)
    useFocusEffect(
        useCallback(() => {
            fetchLocais();
        }, [])
    );

    // <-- LÓGICA DO FILTRO: Roda só quando o filtroAtivo ou textoBusca mudar
    const pontosFiltrados = useMemo(() => {
        let resultado = locais;

        if (filtroAtivo) {
            if (filtroAtivo === 'Academias') {
                resultado = resultado.filter(p => p.pinColor === 'purple');
            } else if (filtroAtivo === 'Hotéis e Pousadas') {
                resultado = resultado.filter(p => p.pinColor === 'pink');
            } else if (filtroAtivo === 'Pontos Turísticos') {
                resultado = resultado.filter(p => p.pinColor === 'blue');
            } else if (filtroAtivo === 'Restaurantes') {
                resultado = resultado.filter(p => p.pinColor === 'orange' || p.pinColor === 'green');
            }
        }

        if (textoBusca.trim() !== '') {
            const textoBuscaLower = textoBusca.toLowerCase().trim();
            resultado = resultado.filter(p =>
                p.title.toLowerCase().includes(textoBuscaLower)
            );
        }
        return resultado;
    }, [filtroAtivo, textoBusca, locais]);

    // <-- MODO APRESENTAÇÃO: RETORNA TUDO
    const locaisFiltrados = useMemo(() => {
        return locais; 
    }, [locais]);

    // <-- FUNÇÕES ADMIN
    const handleAdminAccess = useCallback(() => {
        if (adminPassword === ADMIN_PASSWORD) {
            setAdminModalVisible(false);
            setAdminPassword('');
            router.push('/admin-aprovacao');
        } else {
            Alert.alert('Acesso Negado', 'Senha incorreta.');
            setAdminPassword('');
        }
    }, [adminPassword, router]);

    const handleCloseAdminModal = useCallback(() => {
        setAdminModalVisible(false);
        setAdminPassword('');
    }, []);

    const handleFiltroPress = (filtro) => {
        if (filtroAtivo === filtro) {
            setFiltroAtivo(null);
        } else {
            setFiltroAtivo(filtro);
        }
    };

    const renderListItem = ({ item, index }) => {
        const originalIndex = locais.findIndex(
            p => p.title === item.title &&
                 p.latitude === item.latitude &&
                 p.longitude === item.longitude
        );
        const itemIndex = originalIndex !== -1 ? originalIndex : index;

        return (
            <TouchableOpacity
                style={styles.listCard}
                onPress={() => {
                    router.push({
                        pathname: `/local/${itemIndex}` as any,
                        params: {
                            ...item,
                            latitude: item.latitude.toString(),
                            longitude: item.longitude.toString(),
                        },
                    });
                }}
            >
                <Image
                    source={{
                        uri:
                            (item.foto && typeof item.foto === 'string' && item.foto.trim().length > 0)
                                ? item.foto
                                : ((item.image && typeof item.image === 'string' && item.image.trim().length > 0)
                                    ? item.image
                                    : 'https://via.placeholder.com/300x200.png?text=Imagem+indisponivel')
                    }}
                    style={styles.listCardImage}
                    resizeMode="cover"
                />
                <View style={styles.listCardContent}>
                    <Text style={styles.listCardTitle}>{item.title}</Text>
                    {/* LEGENDA DE STATUS FOI REMOVIDA AQUI */}
                    <Text style={styles.listCardDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.mainContent}>
            {visualizacaoLista ? (
                // <-- VISUALIZAÇÃO EM LISTA
                <View style={styles.listContainer}>
                    <TextInput
                        placeholder="Aonde você quer ir?"
                        placeholderTextColor="#888"
                        value={textoBusca}
                        onChangeText={setTextoBusca}
                        style={styles.searchBarList}
                    />

                    <FlatList
                        data={locaisFiltrados}
                        renderItem={renderListItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        // ADICIONADO PULL TO REFRESH
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={fetchLocais} />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <FontAwesome name="inbox" size={48} color="#999" />
                                <Text style={styles.emptyText}>Nenhum local encontrado</Text>
                            </View>
                        }
                        ListHeaderComponent={
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.chipsContainer}
                                contentContainerStyle={styles.chipsContent}
                            >
                                <TouchableOpacity
                                    style={[styles.chip, filtroAtivo === 'Academias' && styles.chipActive]}
                                    onPress={() => handleFiltroPress('Academias')}
                                >
                                    <Text style={[styles.chipText, filtroAtivo === 'Academias' && styles.chipTextActive]}>Academias</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.chip, filtroAtivo === 'Restaurantes' && styles.chipActive]}
                                    onPress={() => handleFiltroPress('Restaurantes')}
                                >
                                    <Text style={[styles.chipText, filtroAtivo === 'Restaurantes' && styles.chipTextActive]}>Restaurantes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.chip, filtroAtivo === 'Pontos Turísticos' && styles.chipActive]}
                                    onPress={() => handleFiltroPress('Pontos Turísticos')}
                                >
                                    <Text style={[styles.chipText, filtroAtivo === 'Pontos Turísticos' && styles.chipTextActive]}>Pontos Turísticos</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.chip, filtroAtivo === 'Hotéis e Pousadas' && styles.chipActive]}
                                    onPress={() => handleFiltroPress('Hotéis e Pousadas')}
                                >
                                    <Text style={[styles.chipText, filtroAtivo === 'Hotéis e Pousadas' && styles.chipTextActive]}>Hotéis e Pousadas</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        }
                    />

                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setVisualizacaoLista(false)}
                    >
                        <Text style={styles.toggleButtonText}>Ver Mapa 🗺️</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // <-- VISUALIZAÇÃO NO MAPA
                <View style={styles.mapContainer}>
                    <MapComponent pontos={locaisFiltrados} style={styles.map} />

                    <TextInput
                        placeholder="Aonde você quer ir?"
                        placeholderTextColor="#888"
                        value={textoBusca}
                        onChangeText={setTextoBusca}
                        style={styles.searchBar}
                    />

                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setVisualizacaoLista(true)}
                    >
                        <Text style={styles.toggleButtonText}>Ver Lista 📄</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.adminFab}
                        onPress={() => setAdminModalVisible(true)}
                    >
                        <FontAwesome name="lock" size={24} color="#fff" />
                    </TouchableOpacity>

                    {!visualizacaoLista && (
                        <View style={styles.filterButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.filterButton, filtroAtivo === 'Academias' && styles.filterButtonActive]}
                                onPress={() => handleFiltroPress('Academias')}
                            >
                                <Text style={[styles.filterButtonText, filtroAtivo === 'Academias' && styles.filterButtonTextActive]}>Academias</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterButton, filtroAtivo === 'Restaurantes' && styles.filterButtonActive]}
                                onPress={() => handleFiltroPress('Restaurantes')}
                            >
                                <Text style={[styles.filterButtonText, filtroAtivo === 'Restaurantes' && styles.filterButtonTextActive]}>Restaurantes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterButton, filtroAtivo === 'Pontos Turísticos' && styles.filterButtonActive]}
                                onPress={() => handleFiltroPress('Pontos Turísticos')}
                            >
                                <Text style={[styles.filterButtonText, filtroAtivo === 'Pontos Turísticos' && styles.filterButtonTextActive]}>Pontos Turísticos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterButton, filtroAtivo === 'Hotéis e Pousadas' && styles.filterButtonActive]}
                                onPress={() => handleFiltroPress('Hotéis e Pousadas')}
                            >
                                <Text style={[styles.filterButtonText, filtroAtivo === 'Hotéis e Pousadas' && styles.filterButtonTextActive]}>Hotéis e Pousadas</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {/* <-- MODAL DE ACESSO ADMINISTRATIVO */}
            <Modal
                visible={adminModalVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCloseAdminModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Acesso Administrativo</Text>
                        <Text style={styles.modalSubtitle}>Digite a senha para continuar</Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Senha"
                            placeholderTextColor="#999"
                            secureTextEntry
                            value={adminPassword}
                            onChangeText={setAdminPassword}
                            onSubmitEditing={handleAdminAccess}
                        />

                        <View style={styles.modalButtonsRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={handleCloseAdminModal}
                            >
                                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonEnter]}
                                onPress={handleAdminAccess}
                            >
                                <Text style={styles.modalButtonTextEnter}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f3f4f6',
    },
    mapContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    searchBar: {
        position: 'absolute',
        top: 60,
        left: '5%',
        width: '90%',
        zIndex: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 5,
        fontSize: 16,
        color: '#000',
    },
    filterButtonsContainer: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        zIndex: 10,
    },
    filterButton: {
        backgroundColor: '#0027a6ff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderWidth: 2, 
        borderColor: '#0027a6ff', 
    },
    filterButtonActive: {
        backgroundColor: '#fff',
        borderColor: '#0027a6ff',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    filterButtonTextActive: {
        color: '#0027a6ff',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    searchBarList: {
        marginTop: 60,
        marginHorizontal: 20,
        marginBottom: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 5,
        fontSize: 16,
        color: '#000',
    },
    listContent: {
        padding: 20,
        paddingTop: 10, 
        paddingBottom: 100,
    },
    listCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        padding: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    listCardImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    listCardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    listCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0027a6ff',
        marginBottom: 6,
    },
    listCardDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    toggleButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
        backgroundColor: '#0027a6ff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    toggleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    adminFab: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        zIndex: 999,
        backgroundColor: '#333333',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '85%',
        maxWidth: 320,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0027a6ff',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 20,
        color: '#000',
    },
    modalButtonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonCancel: {
        backgroundColor: '#e0e0e0',
    },
    modalButtonEnter: {
        backgroundColor: '#0027a6ff',
    },
    modalButtonTextCancel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    modalButtonTextEnter: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    chipsContainer: {
        marginBottom: 15,
    },
    chipsContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    chip: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
    },
    chipActive: {
        backgroundColor: '#0027a6ff',
    },
    chipText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },
    chipTextActive: {
        color: '#fff',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
        fontWeight: '500',
    },
});