import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function CadastrarLocalScreen() {
    const router = useRouter();

    // Estados dos campos
    const [nome, setNome] = useState('');
    const [endereco, setEndereco] = useState('');
    const [telefone, setTelefone] = useState('');
    const [sobre, setSobre] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);

    const handleSelecionarImagem = async () => {
        try {
            Alert.alert(
                'Foto do Local',
                'Como deseja adicionar a imagem?',
                [
                    {
                        text: 'Tirar Foto',
                        onPress: async () => {
                            try {
                                const result = await ImagePicker.launchCameraAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                    allowsEditing: true,
                                    aspect: [4, 3],
                                    quality: 1,
                                    base64: true,
                                });
                                if (!result.canceled && result.assets && result.assets.length > 0) {
                                    const asset = result.assets[0];
                                    try {
                                        const manipulated = await ImageManipulator.manipulateAsync(
                                            asset.uri,
                                            [{ resize: { width: 1080 } }],
                                            { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG, base64: true }
                                        );
                                        setImageUri(manipulated.uri || null);
                                        setImageBase64(manipulated.base64 || null);
                                    } catch (err) {
                                        setImageUri(asset.uri || null);
                                        setImageBase64(asset.base64 || null);
                                    }
                                }
                            } catch (e) {
                                Alert.alert('Erro', 'Não foi possível abrir a câmera. Verifique as permissões.');
                            }
                        },
                    },
                    {
                        text: 'Escolher da Galeria',
                        onPress: async () => {
                            try {
                                const result = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                    allowsEditing: true,
                                    aspect: [4, 3],
                                    quality: 1,
                                    base64: true,
                                });
                                if (!result.canceled && result.assets && result.assets.length > 0) {
                                    const asset = result.assets[0];
                                    try {
                                        const manipulated = await ImageManipulator.manipulateAsync(
                                            asset.uri,
                                            [{ resize: { width: 1080 } }],
                                            { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG, base64: true }
                                        );
                                        setImageUri(manipulated.uri || null);
                                        setImageBase64(manipulated.base64 || null);
                                    } catch (err) {
                                        setImageUri(asset.uri || null);
                                        setImageBase64(asset.base64 || null);
                                    }
                                }
                            } catch (e) {
                                Alert.alert('Erro', 'Não foi possível abrir a galeria.');
                            }
                        },
                    },
                    { text: 'Cancelar', style: 'cancel' },
                ]
            );
        } catch (e) {
            Alert.alert('Erro', 'Falha ao selecionar imagem.');
        }
    };

    const handleSalvar = async () => {
        try {
            // 1. Validação básica
            if (!nome.trim() || !endereco.trim() || !telefone.trim() || !sobre.trim() || !latitude.trim() || !longitude.trim()) {
                Alert.alert('Campos obrigatórios', 'Preencha todos os campos antes de salvar.');
                return;
            }

            // 2. Preparação dos dados
            const lat = parseFloat(latitude.replace(',', '.'));
            const lon = parseFloat(longitude.replace(',', '.'));

            if (Number.isNaN(lat) || Number.isNaN(lon)) {
                Alert.alert('Coordenadas inválidas', 'Latitude e Longitude devem ser números válidos.');
                return;
            }

            const payload: any = {
                nome: nome.trim(),
                endereco: endereco.trim(),
                telefone: telefone.trim(),
                sobre: sobre.trim(),
                latitude: lat,
                longitude: lon,
                // AQUI FOI A MUDANÇA: de 'image' para 'foto'
                foto: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
                usuario_id: 1,
                categorias_id: 1,
                status_validacao: 'aprovado',
            };

            // 3. Envio
            const response = await axios.post(
                'https://guia-santa-cruz-api.onrender.com/api/locais',
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // 4. Feedback
            if (response.status === 201 || response.status === 200) {
                Alert.alert('Sucesso', 'Local cadastrado com sucesso!');
                router.back();
            } else {
                Alert.alert('Atenção', `Não foi possível confirmar o cadastro. Código: ${response.status}`);
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || 'Erro inesperado ao salvar o local.';
            Alert.alert('Erro', String(message));
        }
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
                <View style={styles.backButton} />
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
                        value={nome}
                        onChangeText={setNome}
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
                        value={sobre}
                        onChangeText={setSobre}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                </View>

                {/* Campos: Latitude e Longitude */}
                <View style={[styles.inputGroup, { marginBottom: 10 }]}>
                    <Text style={styles.label}>Latitude</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: -7.9632"
                        placeholderTextColor="#999"
                        value={latitude}
                        onChangeText={setLatitude}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Longitude</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: -41.7183"
                        placeholderTextColor="#999"
                        value={longitude}
                        onChangeText={setLongitude}
                        keyboardType="numeric"
                    />
                </View>

                {/* Botão de Foto */}
                <TouchableOpacity style={styles.photoButton} onPress={handleSelecionarImagem}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.photoPreview} resizeMode="cover" />
                    ) : (
                        <>
                            <FontAwesome name="camera" size={32} color="#0027a6ff" />
                            <Text style={styles.photoButtonText}>Adicionar Foto da Capa</Text>
                        </>
                    )}
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
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#0027a6ff',
        borderStyle: 'dashed',
        marginBottom: 30,
        overflow: 'hidden',
        height: 180,
    },
    photoButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0027a6ff',
        marginTop: 10,
    },
    photoPreview: {
        width: '100%',
        height: '100%',
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
