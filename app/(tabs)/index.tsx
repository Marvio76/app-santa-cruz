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
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import MapComponent from '../../components/MapComponent';
import axios from 'axios';

// Admin password
const ADMIN_PASSWORD = '1234';

export default function Index() {
    const router = useRouter();

    // <-- MEMÓRIA DO FILTRO: null = mostrar tudo
    const [filtroAtivo, setFiltroAtivo] = useState(null);

    // <-- ESTADO DA BARRA DE BUSCA
    const [textoBusca, setTextoBusca] = useState('');

    // <-- ESTADO DA VISUALIZAÇÃO: false = mapa, true = lista
    const [visualizacaoLista, setVisualizacaoLista] = useState(false);

    // <-- ESTADO DO MODAL DE ADMIN
    const [adminModalVisible, setAdminModalVisible] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    // 📍 Lista de pontos no mapa (JSON FAKE DO MARVIO)
   const PONTOS_ESTATICOS = [
        {
            title: 'Comercio Fernandes',
            description: 'Um comércio local conhecido pelo bom atendimento e variedade de produtos da região.',
            latitude: -5.80722,
            longitude: -41.95426,
            pinColor: 'orange', // <-- Vamo usar isso
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Restaurantes/Comércio de comida
        },
        {
            title: 'Comercio Santa Cruz',
            description: 'Frutaria com frutas sempre frescas e selecionadas, direto dos produtores locais.',
            latitude: -5.80395,
            longitude: -41.95365,
            pinColor: 'green', // <-- Vamo usar isso
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Restaurantes/Comércio de comida
        },
        {
            title: 'Comercio olho d\'agua',
            description: 'Espaço agradável com grande variedade de frutas, verduras e produtos naturais.',
            latitude: -5.79952,
            longitude: -41.95657,
            pinColor: 'green',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Restaurantes/Comércio de comida
        },
        {
            title: 'Comercio Azevedo',
            description: 'Frutaria bem localizada, com excelente qualidade e preços acessíveis.',
            latitude: -5.80339,
            longitude: -41.96101,
            pinColor: 'green',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Restaurantes/Comércio de comida
        },
        {
            title: 'Olho a Agua',
            description: 'Ponto natural muito visitado, com nascente de água limpa e paisagem tranquila.',
            latitude: -5.79965,
            longitude: -41.95587,
            pinColor: 'blue', // <-- Vamo usar isso (Ponto Turístico)
            image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=80', // Natureza/Olho d'água
        },
        {
            title: 'Comercio Central',
            description: 'Loja tradicional com produtos variados e ótimo atendimento aos moradores locais.',
            latitude: -5.80292,
            longitude: -41.9615,
            pinColor: 'orange',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Restaurantes/Comércio de comida
        },
        {
            title: 'Comercio Sao Jose',
            description: 'Frutaria familiar com atendimento simpático e produtos de excelente qualidade.',
            latitude: -5.80067,
            longitude: -41.95818,
            pinColor: 'green',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Restaurantes/Comércio de comida
        },
        {
            title: 'Comercio Chico julia',
            description: 'Local acolhedor com frutas fresquinhas e ambiente limpo e organizado.',
            latitude: -5.80315,
            longitude: -41.95365,
            pinColor: 'green',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Restaurantes/Comércio de comida
        },
        {
            title: 'Comercio Ze Omano',
            description: 'Comércio com boa reputação, variedade de produtos e preços justos.',
            latitude: -5.80355,
            longitude: -41.95297,
            pinColor: 'orange',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Restaurantes/Comércio de comida
        },
        {
            title: 'Academia FitLife',
            description: 'Academia moderna e bem equipada, ideal para quem busca saúde e bem-estar.',
            latitude: -5.79944,
            longitude: -41.95658,
            pinColor: 'purple', // <-- Vamo usar isso
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', // Academias
        },
        {
            title: 'Lava-jato Gustavo',
            description: 'Lava-jato com excelente reputação, oferecendo limpeza completa e detalhada.',
            latitude: -5.80701,
            longitude: -41.96138,
            pinColor: 'cyan',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Comércio genérico
        },
        {
            title: 'Pousada Ailton',
            description: 'Pousada acolhedora com ótimo conforto e atendimento, ideal para visitantes da cidade.',
            latitude: -5.81472,
            longitude: -41.95459,
            pinColor: 'pink', // <-- Vamo usar isso
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', // Hotéis/Pousadas
        },
    ];

    // Estado que conterá estáticos + API
    const [locais, setLocais] = useState(PONTOS_ESTATICOS);

    // Buscar locais da API e combinar
    const fetchLocais = useCallback(async () => {
        try {
            const response = await axios.get('https://guia-santa-cruz-api.onrender.com/api/locais');
            const apiData = Array.isArray(response.data) ? response.data : [];
            // Padroniza campos vindos da API para o formato dos pontos estáticos
            const normalizados = apiData
                .map((item) => {
                    // Campos possíveis: nome/sobre/latitude/longitude/foto/image
                    const title = item.title || item.nome || '';
                    const description = item.description || item.sobre || '';
                    const latitude = typeof item.latitude === 'number' ? item.latitude : parseFloat(String(item.latitude));
                    const longitude = typeof item.longitude === 'number' ? item.longitude : parseFloat(String(item.longitude));
                    const foto = item.foto || undefined;
                    const image = item.image || item.imagem || foto || undefined;
                    if (!title || Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
                    return {
                        title,
                        description,
                        latitude,
                        longitude,
                        foto,
                        image: image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
                        // pinColor default, sem categorização vinda da API
                        pinColor: 'orange',
                    };
                })
                .filter(Boolean);

            const listaCombinada = [...PONTOS_ESTATICOS, ...normalizados];
            setLocais(listaCombinada);
        } catch (e) {
            // Em caso de erro, mantém os estáticos
            setLocais(PONTOS_ESTATICOS);
        }
    }, []);

    // Chama quando a tela ganha foco
    useFocusEffect(
        useCallback(() => {
            fetchLocais();
        }, [fetchLocais])
    );

    // <-- LÓGICA DO FILTRO: Roda só quando o filtroAtivo ou textoBusca mudar
    const pontosFiltrados = useMemo(() => {
        // 1. Comece com a lista completa de pontos
        let resultado = locais;

        // 2. Se filtroAtivo não for nulo, filtre os pontos pela pinColor
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

        // 3. Se textoBusca não estiver vazio, filtre o resultado anterior verificando se o ponto.title inclui o texto digitado (case insensitive)
        if (textoBusca.trim() !== '') {
            const textoBuscaLower = textoBusca.toLowerCase().trim();
            resultado = resultado.filter(p =>
                p.title.toLowerCase().includes(textoBuscaLower)
            );
        }

        // 4. Retorne a lista filtrada pelos dois critérios
        return resultado;
    }, [filtroAtivo, textoBusca, locais]); // Atualiza quando filtroAtivo, textoBusca ou locais mudar

    // <-- FUNÇÃO PARA LIDAR COM ACESSO ADMIN
    const handleAdminAccess = useCallback(() => {
        if (adminPassword === ADMIN_PASSWORD) {
            setAdminModalVisible(false);
            setAdminPassword('');
            router.push('/admin-aprovacao');
        } else {
            Alert.alert('Acesso Negado', 'Senha incorreta. Tente novamente.');
            setAdminPassword('');
        }
    }, [adminPassword, router]);

    const handleCloseAdminModal = useCallback(() => {
        setAdminModalVisible(false);
        setAdminPassword('');
    }, []);

    // <-- FUNÇÃO DO CLIQUE: O que o botão faz
    const handleFiltroPress = (filtro) => {
        if (filtroAtivo === filtro) {
            setFiltroAtivo(null); // Limpa o filtro
        } else {
            setFiltroAtivo(filtro); // Bota o filtro
        }
    };

    // <-- FUNÇÃO PARA RENDERIZAR CADA ITEM DA LISTA
    const renderListItem = ({ item, index }) => {
        // Encontra o índice do item na lista original de pontos
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
                    {/* <-- BARRA DE BUSCA */}
                    <TextInput
                        placeholder="Aonde você quer ir?"
                        placeholderTextColor="#888"
                        value={textoBusca}
                        onChangeText={setTextoBusca}
                        style={styles.searchBarList}
                    />

                    {/* <-- FLATLIST COM OS PONTOS FILTRADOS */}
                    <FlatList
                        data={pontosFiltrados}
                        renderItem={renderListItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.chipsContainer}
                                contentContainerStyle={styles.chipsContent}
                            >
                                <TouchableOpacity
                                    style={[
                                        styles.chip,
                                        filtroAtivo === 'Academias' && styles.chipActive
                                    ]}
                                    onPress={() => handleFiltroPress('Academias')}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            filtroAtivo === 'Academias' && styles.chipTextActive
                                        ]}
                                    >
                                        Academias
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.chip,
                                        filtroAtivo === 'Restaurantes' && styles.chipActive
                                    ]}
                                    onPress={() => handleFiltroPress('Restaurantes')}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            filtroAtivo === 'Restaurantes' && styles.chipTextActive
                                        ]}
                                    >
                                        Restaurantes
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.chip,
                                        filtroAtivo === 'Pontos Turísticos' && styles.chipActive
                                    ]}
                                    onPress={() => handleFiltroPress('Pontos Turísticos')}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            filtroAtivo === 'Pontos Turísticos' && styles.chipTextActive
                                        ]}
                                    >
                                        Pontos Turísticos
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.chip,
                                        filtroAtivo === 'Hotéis e Pousadas' && styles.chipActive
                                    ]}
                                    onPress={() => handleFiltroPress('Hotéis e Pousadas')}
                                >
                                    <Text
                                        style={[
                                            styles.chipText,
                                            filtroAtivo === 'Hotéis e Pousadas' && styles.chipTextActive
                                        ]}
                                    >
                                        Hotéis e Pousadas
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
                        }
                    />

                    {/* <-- BOTÃO PARA VOLTAR AO MAPA */}
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
                    {/* <-- O MAPA AGORA USA OS PONTOS FILTRADOS */}
                    <MapComponent pontos={pontosFiltrados} style={styles.map} />

                    {/* <-- BARRA DE BUSCA FLUTUANTE */}
                    <TextInput
                        placeholder="Aonde você quer ir?"
                        placeholderTextColor="#888"
                        value={textoBusca}
                        onChangeText={setTextoBusca}
                        style={styles.searchBar}
                    />

                    {/* <-- BOTÃO PARA VER LISTA */}
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={() => setVisualizacaoLista(true)}
                    >
                        <Text style={styles.toggleButtonText}>Ver Lista 📄</Text>
                    </TouchableOpacity>

                    {/* <-- BOTÃO ADMIN FAB (FLOATING ACTION BUTTON) */}
                    <TouchableOpacity
                        style={styles.adminFab}
                        onPress={() => setAdminModalVisible(true)}
                    >
                        <FontAwesome name="lock" size={24} color="#fff" />
                    </TouchableOpacity>

                    {/* <-- CONTAINER DOS BOTÕES COM A LÓGICA CORRIGIDA - SÓ NO MODO MAPA */}
                    {!visualizacaoLista && (
                        <View style={styles.filterButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.filterButton, filtroAtivo === 'Academias' && styles.filterButtonActive]}
                                onPress={() => handleFiltroPress('Academias')}
                            >
                                <Text style={[styles.filterButtonText, filtroAtivo === 'Academias' && styles.filterButtonTextActive]}>
                                    Academias
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.filterButton, filtroAtivo === 'Restaurantes' && styles.filterButtonActive]}
                                onPress={() => handleFiltroPress('Restaurantes')}
                            >
                                <Text style={[styles.filterButtonText, filtroAtivo === 'Restaurantes' && styles.filterButtonTextActive]}>
                                    Restaurantes
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.filterButton, filtroAtivo === 'Pontos Turísticos' && styles.filterButtonActive]}
                                onPress={() => handleFiltroPress('Pontos Turísticos')}
                            >
                                <Text style={[styles.filterButtonText, filtroAtivo === 'Pontos Turísticos' && styles.filterButtonTextActive]}>
                                    Pontos Turísticos
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.filterButton, filtroAtivo === 'Hotéis e Pousadas' && styles.filterButtonActive]}
                                onPress={() => handleFiltroPress('Hotéis e Pousadas')}
                            >
                                <Text style={[styles.filterButtonText, filtroAtivo === 'Hotéis e Pousadas' && styles.filterButtonTextActive]}>
                                    Hotéis e Pousadas
                                </Text>
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
        borderWidth: 2, // Borda pra destacar
        borderColor: '#0027a6ff', // Borda da mesma cor
    },
    // <-- ESTILO DO BOTÃO ATIVO (FUNDO BRANCO)
    filterButtonActive: {
        backgroundColor: '#fff',
        borderColor: '#0027a6ff',
    },
    filterButtonText: {
        color: '#fff', // TEXTO PADRÃO BRANCO
        fontWeight: 'bold',
        fontSize: 14,
    },
    // <-- ESTILO DO TEXTO ATIVO (TEXTO AZUL)
    filterButtonTextActive: {
        color: '#0027a6ff',
    },
    // <-- ESTILOS DA LISTA
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
        paddingTop: 10, // Menos espaço no topo porque os chips já têm margin
        paddingBottom: 100, // Espaço para o botão de alternância
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
    // <-- BOTÃO DE ALTERNÂNCIA
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
    // <-- BOTÃO ADMIN FAB
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
    // <-- MODAL STYLES
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
    // <-- ESTILOS DOS CHIPS (FILTROS HORIZONTAIS NO MODO LISTA)
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
});
