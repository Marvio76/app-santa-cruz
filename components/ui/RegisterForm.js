import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterForm({ onRegister }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // ADICIONADO: Estado pra confirmar senha
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [loading, setLoading] = useState(false);
    // ADICIONADO: Erro pra confirmar senha
    const [error, setError] = useState({ nome: '', email: '', password: '', confirmPassword: '' }); 

    const validate = () => {
        let valid = true;
        // Limpa erros antigos e adiciona o confirmPassword
        const newError = { nome: '', email: '', password: '', confirmPassword: '' }; 

        if (!nome || nome.trim().length < 3) {
            newError.nome = 'Nome inválido (mínimo 3 caracteres)';
            valid = false;
        }
        if (!email || !email.includes('@')) {
            newError.email = 'Email inválido';
            valid = false;
        }
        if (!password || password.length < 6) {
            newError.password = 'Senha deve ter ao menos 6 caracteres';
            valid = false;
        }
        // ADICIONADO: Validação pra ver se as senhas batem
        if (password !== confirmPassword) {
            newError.confirmPassword = 'As senhas não conferem';
            valid = false;
        }
        setError(newError);
        return valid;
    };

    const handlePressRegister = () => {
        // A validação agora checa se as senhas batem ANTES de continuar
        if (!validate()) return; 

        // Só manda nome, email e password pra API (ela não precisa da confirmação)
        const credentials = { nome, email, password }; 
        console.log('RegisterForm -> Chamando onRegister com:', credentials);
        setLoading(true);

        setTimeout(() => { // Tira essa merda depois
             if (onRegister) {
                 onRegister(credentials);
             }
             setLoading(false); // Tirar daqui depois
        }, 300);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>Crie sua conta rapidinho</Text>

            <TextInput
                style={[styles.input, error.nome && styles.inputError]}
                placeholder="Nome Completo"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
            />
            {error.nome ? <Text style={styles.error}>{error.nome}</Text> : null}

            <TextInput
                style={[styles.input, error.email && styles.inputError]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {error.email ? <Text style={styles.error}>{error.email}</Text> : null}

            <TextInput
                style={[styles.input, error.password && styles.inputError]}
                placeholder="Senha (mínimo 6 caracteres)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error.password ? <Text style={styles.error}>{error.password}</Text> : null}

            {/* ADICIONADO: Campo Confirmar Senha */}
            <TextInput
                style={[styles.input, error.confirmPassword && styles.inputError]}
                placeholder="Confirme a Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            {error.confirmPassword ? <Text style={styles.error}>{error.confirmPassword}</Text> : null}


            <TouchableOpacity style={styles.button} onPress={handlePressRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>CADASTRAR</Text>}
            </TouchableOpacity>
        </View>
    );
}

// Estilos (mantive os mesmos, adicionei nada)
const styles = StyleSheet.create({
    container: { width: '90%', maxWidth: 400, padding: 20, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 5 },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
    inputError: { borderColor: '#f00' },
    error: { color: '#f00', fontSize: 12, marginTop: -8, marginBottom: 8 },
    button: { backgroundColor: '#0027a6ff', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});