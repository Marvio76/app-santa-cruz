import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function TelaInicial() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const slideAnim = new Animated.Value(0);

    // 📍 Lista de pontos no mapa
    const pontos = [
        {
            title: 'Comercio_01',
            description: 'Um comércio local conhecido pelo bom atendimento e variedade de produtos da região.',
            latitude: -5.80722,
            longitude: -41.95426,
            pinColor: 'orange',
        },
        {
            title: 'Comercio-Frutaria_02',
            description: 'Frutaria com frutas sempre frescas e selecionadas, direto dos produtores locais.',
            latitude: -5.80395,
            longitude: -41.95365,
            pinColor: 'green',
        },
        {
            title: 'Comercio-Frutaria_03',
            description: 'Espaço agradável com grande variedade de frutas, verduras e produtos naturais.',
            latitude: -5.79952,
            longitude: -41.95657,
            pinColor: 'green',
        },
        {
            title: 'Comercio-Frutaria_04',
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
            pinColor: 'blue',
        },
        {
            title: 'Comercio_05',
            description: 'Loja tradicional com produtos variados e ótimo atendimento aos moradores locais.',
            latitude: -5.80292,
            longitude: -41.9615,
            pinColor: 'orange',
        },
        {
            title: 'Comercio-Frutaria_06',
            description: 'Frutaria familiar com atendimento simpático e produtos de excelente qualidade.',
            latitude: -5.80067,
            longitude: -41.95818,
            pinColor: 'green',
        },
        {
            title: 'Comercio-Frutaria_07',
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
            title: 'Academia',
            description: 'Academia moderna e bem equipada, ideal para quem busca saúde e bem-estar.',
            latitude: -5.79944,
            longitude: -41.95658,
            pinColor: 'purple',
        },
        {
            title: 'Cemiterio-Central_01',
            description: 'Cemitério central da cidade, bem cuidado e com estrutura organizada para visitas.',
            latitude: -5.80097,
            longitude: -41.95791,
            pinColor: 'gray',
        },
        {
            title: 'Lava-jato',
            description: 'Lava-jato com excelente reputação, oferecendo limpeza completa e detalhada.',
            latitude: -5.80701,
            longitude: -41.96138,
            pinColor: 'cyan',
        },
        {
            title: 'Pousada',
            description: 'Pousada acolhedora com ótimo conforto e atendimento, ideal para visitantes da cidade.',
            latitude: -5.81472,
            longitude: -41.95459,
            pinColor: 'pink',
        },
    ];

    useEffect(() => {
        const updateLayout = () => {
            const screenWidth = Dimensions.get('window').width;
            setIsMobile(screenWidth < 700);
        };

        updateLayout();
        const subscription = Dimensions.addEventListener('change', updateLayout);
        return () => {
            if (subscription && typeof subscription.remove === 'function') {
                subscription.remove();
            }
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        Animated.timing(slideAnim, {
            toValue: isMenuOpen ? -250 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            {/* Botão do menu no mobile */}
            {isMobile && (
                <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
            )}

            {/* Menu lateral */}
            <Animated.View
                style={[
                    styles.sidebar,
                    isMobile && {
                        position: 'absolute',
                        left: isMenuOpen ? 0 : -250,
                        zIndex: 10,
                    },
                ]}
            >
                <Text style={styles.appName}>Guia Santa Cruz</Text>

                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            toggleMenu();
                            router.replace('/telaInicial');
                        }}
                        style={styles.menuItem}
                    >
                        <Text style={styles.menuText}>🏠 Tela Inicial</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            toggleMenu();
                            router.push('/historia');
                        }}
                        style={styles.menuItem}
                    >
                        <Text style={styles.menuText}>🏛️ História da Cidade</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        toggleMenu();
                        router.replace('/login');
                    }}
                    style={styles.logoutButton}
                >
                    <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Fundo escuro ao abrir o menu (mobile) */}
            {isMobile && isMenuOpen && (
                <Pressable style={styles.overlay} onPress={toggleMenu} />
            )}

            {/* Conteúdo principal com mapa */}
            <View style={styles.mainContent}>
                <Text style={styles.title}>🗺️ Mapa de Santa Cruz dos Milagres</Text>
                <Text style={styles.description}>
                    Veja os principais pontos turísticos, hotéis, farmácias e restaurantes.
                </Text>

                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: -5.80079,
                        longitude: -41.95145,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    {pontos.map((ponto, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: ponto.latitude,
                                longitude: ponto.longitude,
                            }}
                            title={ponto.title}
                            description={ponto.description}
                            pinColor={ponto.pinColor || 'red'}
                        />
                    ))}
                </MapView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: '100%',
        backgroundColor: '#f3f4f6',
    },
    sidebar: {
        width: 250,
        backgroundColor: '#1e3a8a',
        padding: 24,
        justifyContent: 'space-between',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    appName: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    menuContainer: {
        marginTop: 20,
    },
    menuItem: {
        marginVertical: 10,
    },
    menuText: {
        color: 'white',
        fontSize: 18,
    },
    logoutButton: {
        backgroundColor: '#dc2626',
        padding: 12,
        borderRadius: 12,
        marginTop: 20,
    },
    logoutText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    mainContent: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 5,
        textAlign: 'center',
    },
    description: {
        color: '#374151',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    map: {
        width: '100%',
        height: '85%',
        borderRadius: 15,
    },
    menuButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 20,
        backgroundColor: '#1e3a8a',
        padding: 10,
        borderRadius: 10,
    },
    menuIcon: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 5,
    },
});
