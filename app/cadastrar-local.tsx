import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function CadastrarLocalScreen() {
    const router = useRouter();

    const [nomeLocal, setNomeLocal] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [descricao, setDescricao] = useState('');

    const handleSalvar = () => {
        // TODO: Implementar lógica de salvamento
        console.log('Salvando local:', {
            nomeLocal,
            endereco,
            telefone,
            descricao,
        });
        // Por enquanto, apenas volta
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <FontAwesome name="arrow-left" size={24} color="#0027a6ff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Local</Text>
                <View style={styles.backButton} /> {/* Espaçador para centralizar o título */}
            </View>

            {/* Formulário */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Campo: Nome do Local */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome do Local</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Restaurante do João"
                        placeholderTextColor="#999"
                        value={nomeLocal}
                        onChangeText={setNomeLocal}
                    />
                </View>

                {/* Campo: Endereço */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Endereço</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Rua Principal, 123"
                        placeholderTextColor="#999"
                        value={endereco}
                        onChangeText={setEndereco}
                    />
                </View>

                {/* Campo: Telefone (Zap) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Telefone (WhatsApp)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: (89) 99999-9999"
                        placeholderTextColor="#999"
                        value={telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Campo: Descrição / Sobre */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descrição / Sobre</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        placeholder="Descreva o local, seus serviços, horários de funcionamento..."
                        placeholderTextColor="#999"
                        value={descricao}
                        onChangeText={setDescricao}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                </View>

                {/* Botão de Foto */}
                <TouchableOpacity style={styles.photoButton}>
                    <FontAwesome name="camera" size={32} color="#0027a6ff" />
                    <Text style={styles.photoButtonText}>Adicionar Foto da Capa</Text>
                </TouchableOpacity>

                {/* Botão de Salvar */}
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSalvar}
                >
                    <Text style={styles.saveButtonText}>Salvar Local</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0027a6ff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    inputMultiline: {
        minHeight: 120,
        paddingTop: 12,
    },
    photoButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#0027a6ff',
        borderStyle: 'dashed',
        marginBottom: 30,
    },
    photoButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0027a6ff',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#0027a6ff',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

