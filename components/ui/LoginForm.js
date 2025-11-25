import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ email: '', password: '' });

    const validate = () => {
        let valid = true;
        const newError = { email: '', password: '' };
        if (!email || !email.includes('@')) {
            newError.email = 'Email inválido';
            valid = false;
        }
        if (!password || password.length < 6) {
            newError.password = 'Senha deve ter ao menos 6 caracteres';
            valid = false;
        }
        setError(newError);
        return valid;
    };

    const handlePressLogin = () => {
        if (!validate()) return;
        const credentials = { email, password };
        console.log('LoginForm -> Chamando onLogin com:', credentials); // Dedo-duro
        setLoading(true);
        // Simulando um pequeno delay caso a chamada seja muito rápida
        setTimeout(() => {
             if (onLogin) {
                 onLogin(credentials); // Chama a função que veio do pai (login.tsx)
             }
             // Atenção: A lógica real de parar o loading deve vir da tela pai,
             // após a resposta da API, mas deixei aqui por enquanto.
             setLoading(false);
        }, 300); // Delay pequeno
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>para continuar na sua conta</Text>
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
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error.password ? <Text style={styles.error}>{error.password}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handlePressLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>LOGIN</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: '90%', maxWidth: 400, padding: 20, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 5 },
    title: { fontSize: 28, fontWeight: '700', color: '#0027a6ff', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
    inputError: { borderColor: '#f00' },
    error: { color: '#f00', fontSize: 12, marginTop: -8, marginBottom: 8 }, // Ajuste no estilo do erro
    button: { backgroundColor: '#0027a6ff', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 }, // Adicionei margem
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
