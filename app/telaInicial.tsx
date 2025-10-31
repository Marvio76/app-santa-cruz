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
            title: 'Santa Cruz dos Milagres',
            description: 'Piauí - Brasil',
            latitude: -5.800790931713065,
            longitude: -41.951456337341085,
        },
        {
            title: 'Santuário de Santa Cruz dos Milagres ⛪',
            description: 'Principal ponto turístico e religioso da cidade.',
            latitude: -5.8015,
            longitude: -41.952,
        },
        {
            title: 'Hotel Santa Cruz 🏨',
            description: 'Hospedagem próxima ao centro.',
            latitude: -5.802,
            longitude: -41.950,
            pinColor: 'blue',
        },
        {
            title: 'Farmácia Central 💊',
            description: 'Aberta todos os dias.',
            latitude: -5.799,
            longitude: -41.951,
            pinColor: 'green',
        },
        {
            title: 'Restaurante 🍴',
            description: 'Deliciosa comida local.',
            latitude: -5.80552,
            longitude: -41.96177,
            pinColor: 'orange',
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
                        latitudeDelta: 0.01, // zoom próximo da cidade
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
