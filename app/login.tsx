import { useRouter } from 'expo-router';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import LoginForm from '../components/LoginForm';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = (credentials: { email: string; password: string }) => {
    console.log('Login:', credentials);
    // Aqui você faria a autenticação
    // Após login bem-sucedido:
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>Bem vindo ao Guia Santa Cruz</Text>
          <Text style={styles.welcomeSubtitle}>Faça login para continuar</Text>
        </View>

        <LoginForm onLogin={handleLogin} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8faff',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  registerText: {
    color: '#0027a6ff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#0027a6ff',
    fontSize: 16,
  },
});