import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Historia() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-gray-50 justify-center items-center">
            <Text className="text-3xl font-bold text-blue-900 mb-4">🏛️ História da Cidade</Text>
            <Text className="text-gray-700 text-lg text-center px-8">
                Aqui você pode contar um pouco sobre a origem e cultura de Santa Cruz.
            </Text>

            <TouchableOpacity
                onPress={() => router.push('/(tabs)')}
                className="mt-6 bg-blue-900 p-3 rounded-xl"
            >
                <Text className="text-white text-base">Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

