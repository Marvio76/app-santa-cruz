// components/LoginForm.js
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

        if (!email.includes('@')) {
            newError.email = 'Email inválido';
            valid = false;
        }
        if (password.length < 6) {
            newError.password = 'Senha deve ter ao menos 6 caracteres';
            valid = false;
        }

        setError(newError);
        return valid;
    };

    const handleLogin = () => {
        if (!validate()) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onLogin?.({ email, password });
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>to continue to your account</Text>

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
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error.password ? <Text style={styles.error}>{error.password}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>SIGN IN</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
    },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 12,
    },
    inputError: { borderColor: '#f00' },
    error: { color: '#f00', marginBottom: 8 },
    button: {
        backgroundColor: '#6200ee',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
