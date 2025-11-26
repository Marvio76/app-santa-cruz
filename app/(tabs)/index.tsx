import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapComponent from '../../components/MapComponent';

export default function Index() {
    // <-- MEMÓRIA DO FILTRO: null = mostrar tudo
    const [filtroAtivo, setFiltroAtivo] = useState(null);

    // <-- ESTADO DA BARRA DE BUSCA
    const [textoBusca, setTextoBusca] = useState('');

    // 📍 Lista de pontos no mapa (JSON FAKE DO MARVIO)
   const pontos = [
        {
            title: 'Comercio Fernandes',
            description: 'Um comércio local conhecido pelo bom atendimento e variedade de produtos da região.',
            latitude: -5.80722,
            longitude: -41.95426,
            pinColor: 'orange', // <-- Vamo usar isso
        },
        {
            title: 'Comercio Santa Cruz',
            description: 'Frutaria com frutas sempre frescas e selecionadas, direto dos produtores locais.',
            latitude: -5.80395,
            longitude: -41.95365,
            pinColor: 'green', // <-- Vamo usar isso
        },
        {
            title: 'Comercio olho d\'agua',
            description: 'Espaço agradável com grande variedade de frutas, verduras e produtos naturais.',
            latitude: -5.79952,
            longitude: -41.95657,
            pinColor: 'green',
        },
        {
            title: 'Comercio Azevedo',
            description: 'Frutaria bem localizada, com excelente qualidade e preços acessíveis.',
            latitude: -5.80339,
            longitude: -41.96101,
            pinColor: 'green',
        },
        {
            title: 'Olho a Agua',
            description: 'Ponto natural muito visitado, com nascente de água limpa e paisagem tranquila.',
            latitude: -5.79965,
            longitude: -41.95587,
            pinColor: 'blue', // <-- Vamo usar isso (Ponto Turístico)
        },
        {
            title: 'Comercio Central',
            description: 'Loja tradicional com produtos variados e ótimo atendimento aos moradores locais.',
            latitude: -5.80292,
            longitude: -41.9615,
            pinColor: 'orange',
        },
        {
            title: 'Comercio Sao Jose',
            description: 'Frutaria familiar com atendimento simpático e produtos de excelente qualidade.',
            latitude: -5.80067,
            longitude: -41.95818,
            pinColor: 'green',
        },
        {
            title: 'Comercio Chico julia',
            description: 'Local acolhedor com frutas fresquinhas e ambiente limpo e organizado.',
            latitude: -5.80315,
            longitude: -41.95365,
            pinColor: 'green',
        },
        {
            title: 'Comercio_08',
            description: 'Comércio com boa reputação, variedade de produtos e preços justos.',
            latitude: -5.80355,
            longitude: -41.95297,
            pinColor: 'orange',
        },
        {
            title: 'Academia FitLife',
            description: 'Academia moderna e bem equipada, ideal para quem busca saúde e bem-estar.',
            latitude: -5.79944,
            longitude: -41.95658,
            pinColor: 'purple', // <-- Vamo usar isso
        },
        {
            title: 'Cemiterio Zé omano',
            description: 'Cemitério central da cidade, bem cuidado e com estrutura organizada para visitas.',
            latitude: -5.80097,
            longitude: -41.95791,
            pinColor: 'gray',
        },
        {
            title: 'Lava-jato Gustavo',
            description: 'Lava-jato com excelente reputação, oferecendo limpeza completa e detalhada.',
            latitude: -5.80701,
            longitude: -41.96138,
            pinColor: 'cyan',
        },
        {
            title: 'Pousada Ailton',
            description: 'Pousada acolhedora com ótimo conforto e atendimento, ideal para visitantes da cidade.',
            latitude: -5.81472,
            longitude: -41.95459,
            pinColor: 'pink', // <-- Vamo usar isso
        },
    ];

    // <-- LÓGICA DO FILTRO: Roda só quando o filtroAtivo ou textoBusca mudar
    const pontosFiltrados = useMemo(() => {
        // 1. Comece com a lista completa de pontos
        let resultado = pontos;

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
    }, [filtroAtivo, textoBusca]); // Atualiza quando filtroAtivo ou textoBusca mudar

    // <-- FUNÇÃO DO CLIQUE: O que o botão faz
    const handleFiltroPress = (filtro) => {
        if (filtroAtivo === filtro) {
            setFiltroAtivo(null); // Limpa o filtro
        } else {
            setFiltroAtivo(filtro); // Bota o filtro
        }
    };

    return (
        <View style={styles.mainContent}>
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

                {/* <-- CONTAINER DOS BOTÕES COM A LÓGICA CORRIGIDA */}
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
            </View>
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
});
