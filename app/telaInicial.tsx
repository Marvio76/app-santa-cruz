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

export default function TelaInicial() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const slideAnim = new Animated.Value(0);

    useEffect(() => {
        const updateLayout = () => {
            const screenWidth = Dimensions.get('window').width;
            setIsMobile(screenWidth < 700); // se for menor que 700px = mobile
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

            {/* Menu lateral (com animação no mobile) */}
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

            {/* Conteúdo principal */}
            <View style={styles.mainContent}>
                <Text style={styles.title}>🎉 Bem-vindo à Tela Inicial!</Text>
                <Text style={styles.description}>
                    Aqui você encontrará as principais informações e curiosidades sobre Santa Cruz.
                </Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 10,
    },
    description: {
        color: '#374151',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 24,
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
