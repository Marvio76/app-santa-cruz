import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen() {
    const router = useRouter();

    // Estados de usuário
    const [nome, setNome] = useState<string>('Carregando...');
    const [email, setEmail] = useState<string>('');

    // Carregar usuário do AsyncStorage ao focar na tela
    const carregarUsuario = useCallback(async () => {
        try {
            const dado = await AsyncStorage.getItem('usuario');
            if (dado) {
                const user = JSON.parse(dado);
                setNome(user?.nome || user?.name || 'Usuário');
                setEmail(user?.email || '');
            } else {
                setNome('Usuário Visitante');
                setEmail('');
                // Opcional: redirecionar para login
                // router.replace('/');
            }
        } catch (e) {
            setNome('Usuário Visitante');
            setEmail('');
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregarUsuario();
        }, [carregarUsuario])
    );

    const handleSair = async () => {
        try {
            await AsyncStorage.multiRemove(['token', 'usuario']);
        } catch {}
        router.replace('/');
    };

    const handleMeusLocais = () => {
        // TODO: Navegar para tela de locais cadastrados
        console.log('Meus Locais Cadastrados');
    };

    const handleCadastrarLocal = () => {
        router.push('/cadastrar-local');
    };

    const handleConfiguracoes = () => {
        // TODO: Navegar para tela de configurações
        console.log('Configurações');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Topo: Avatar e Informações do Usuário */}
            <View style={styles.headerSection}>
                <View style={styles.avatarContainer}>
                    <FontAwesome name="user-circle" size={100} color="#0027a6ff" />
                </View>
                <Text style={styles.nomeUsuario}>{nome}</Text>
                <Text style={styles.emailUsuario}>{email}</Text>
            </View>

            {/* Ações: Lista de Botões */}
            <View style={styles.actionsSection}>
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={handleMeusLocais}
                >
                    <View style={styles.actionCardContent}>
                        <FontAwesome name="building" size={24} color="#0027a6ff" />
                        <Text style={styles.actionCardText}>Meus Locais Cadastrados</Text>
                    </View>
                    <FontAwesome name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, styles.actionCardHighlight]}
                    onPress={handleCadastrarLocal}
                >
                    <View style={styles.actionCardContent}>
                        <FontAwesome name="plus-circle" size={24} color="#fff" />
                        <Text style={[styles.actionCardText, styles.actionCardTextHighlight]}>
                            Cadastrar Novo Local
                        </Text>
                    </View>
                    <FontAwesome name="chevron-right" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={handleConfiguracoes}
                >
                    <View style={styles.actionCardContent}>
                        <FontAwesome name="cog" size={24} color="#0027a6ff" />
                        <Text style={styles.actionCardText}>Configurações</Text>
                    </View>
                    <FontAwesome name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>
            </View>

            {/* Rodapé: Botão de Sair */}
            <View style={styles.footerSection}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleSair}
                >
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    contentContainer: {
        paddingBottom: 30,
    },
    headerSection: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    avatarContainer: {
        marginBottom: 20,
    },
    nomeUsuario: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0027a6ff',
        marginBottom: 8,
    },
    emailUsuario: {
        fontSize: 16,
        color: '#666',
    },
    actionsSection: {
        padding: 20,
        paddingTop: 30,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionCardHighlight: {
        backgroundColor: '#0027a6ff',
        elevation: 4,
        shadowOpacity: 0.2,
    },
    actionCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    actionCardText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 15,
    },
    actionCardTextHighlight: {
        color: '#fff',
    },
    footerSection: {
        padding: 20,
        paddingTop: 10,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

