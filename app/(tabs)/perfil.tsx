import React, { useState, useCallback } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Senha de administração
const ADMIN_PASSWORD = 'admin2026';

export default function PerfilScreen() {
    const router = useRouter();

    const [nome, setNome] = useState<string>('Carregando...');
    const [email, setEmail] = useState<string>('');

    // Estados para o Modal de Admin
    const [modalVisible, setModalVisible] = useState(false);
    const [password, setPassword] = useState('');

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
        router.push('/meus-locais');
    };

    const handleCadastrarLocal = () => {
        router.push('/cadastrar-local'); // Mantive sua rota original
    };

    // Lógica de validação da senha
    const handleAdminAccess = () => {
        if (password === ADMIN_PASSWORD) {
            setModalVisible(false);
            setPassword('');
            router.push('/admin-aprovacao');
        } else {
            Alert.alert('Acesso Negado', 'Senha administrativa incorreta.');
            setPassword('');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Topo */}
            <View style={styles.headerSection}>
                <View style={styles.avatarContainer}>
                    <FontAwesome name="user-circle" size={100} color="#0027a6ff" />
                </View>
                <Text style={styles.nomeUsuario}>{nome}</Text>
                <Text style={styles.emailUsuario}>{email}</Text>
            </View>

            {/* Ações */}
            <View style={styles.actionsSection}>

                {/* Botão 1: Meus Locais */}
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

                {/* Botão 2: Cadastrar */}
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={handleCadastrarLocal}
                >
                    <View style={styles.actionCardContent}>
                        <FontAwesome name="plus-circle" size={24} color="#0027a6ff" />
                        <Text style={styles.actionCardText}>
                            Cadastrar Novo Local
                        </Text>
                    </View>
                    <FontAwesome name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

                {/* --- NOVO BOTÃO: Área Administrativa --- */}
                <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => setModalVisible(true)}
                >
                    <View style={styles.actionCardContent}>
                        <FontAwesome name="lock" size={24} color="#FF9800" />
                        <Text style={styles.actionCardText}>
                            Área Administrativa
                        </Text>
                    </View>
                    <FontAwesome name="chevron-right" size={20} color="#999" />
                </TouchableOpacity>

            </View>

            {/* Rodapé */}
            <View style={styles.footerSection}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleSair}
                >
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </View>

            {/* --- MODAL DE SENHA --- */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Acesso Restrito</Text>
                        <Text style={styles.modalSubtitle}>Digite a senha de administrador</Text>
                        
                        <TextInput 
                            style={styles.input}
                            placeholder="Senha"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalBtn, styles.confirmBtn]}
                                onPress={handleAdminAccess}
                            >
                                <Text style={styles.confirmBtnText}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f3f4f6' },
    contentContainer: { paddingBottom: 30 },
    headerSection: { alignItems: 'center', paddingTop: 40, paddingBottom: 30, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    avatarContainer: { marginBottom: 20 },
    nomeUsuario: { fontSize: 24, fontWeight: 'bold', color: '#0027a6ff', marginBottom: 8 },
    emailUsuario: { fontSize: 16, color: '#666' },
    actionsSection: { padding: 20, paddingTop: 30 },
    actionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    actionCardContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    actionCardText: { fontSize: 16, fontWeight: '600', color: '#333', marginLeft: 15 },
    footerSection: { padding: 20, paddingTop: 10 },
    logoutButton: { backgroundColor: '#dc3545', borderRadius: 12, padding: 18, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

    // Estilos do Modal (Adicionados)
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', width: '85%', padding: 25, borderRadius: 15, alignItems: 'center', elevation: 5 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    input: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
    modalButtons: { flexDirection: 'row', width: '100%', gap: 10 },
    modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
    cancelBtn: { backgroundColor: '#f0f0f0' },
    confirmBtn: { backgroundColor: '#0027a6ff' },
    cancelBtnText: { color: '#333', fontWeight: 'bold' },
    confirmBtnText: { color: '#fff', fontWeight: 'bold' }
});