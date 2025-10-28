import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const validate = () => {
    let valid = true;
    const newError = { name: '', email: '', password: '', confirmPassword: '' };

    if (name.trim().length < 2) {
      newError.name = 'Nome deve ter pelo menos 2 caracteres';
      valid = false;
    }

    if (!email.includes('@')) {
      newError.email = 'Endereço de email inválido';
      valid = false;
    }

    if (password.length < 6) {
      newError.password = 'A senha deve ter pelo menos 6 caracteres';
      valid = false;
    }

    if (password !== confirmPassword) {
      newError.confirmPassword = 'As senhas não coincidem';
      valid = false;
    }

    setError(newError);
    return valid;
  };

  const handleRegister = () => {
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Aqui você faria o registro na API
      console.log('Register:', { name, email, password });
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.push('/login');
    }, 2000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Crie sua conta</Text>
          <Text style={styles.welcomeSubtitle}>Junte-se a nós hoje</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={[styles.input, error.name && styles.inputError]}
            placeholder="Nome Completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          {error.name ? <Text style={styles.error}>{error.name}</Text> : null}

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

          <TextInput
            style={[styles.input, error.confirmPassword && styles.inputError]}
            placeholder="Repita sua Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {error.confirmPassword ? <Text style={styles.error}>{error.confirmPassword}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirmar Cadastro</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink} 
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginText}>
              Já tem uma conta? <Text style={styles.loginLinkText}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0027a6ff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  inputError: { 
    borderColor: '#ff3b30' 
  },
  error: { 
    color: '#ff3b30', 
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#0027a6ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 16 
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#0027a6ff',
    fontWeight: '600',
  },
});