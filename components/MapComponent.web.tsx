import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Ponto {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    pinColor?: string;
    image?: string;
}

interface MapComponentProps {
    pontos: Ponto[];
    style?: any;
}

export default function MapComponent({ pontos, style }: MapComponentProps) {
    return (
        <View style={[styles.mapFallback, style]}>
            <Text style={styles.fallbackText}>
                🗺️ Mapa disponível apenas em dispositivos móveis
            </Text>
            <Text style={styles.fallbackSubtext}>
                Para visualizar o mapa, acesse pelo aplicativo no iOS ou Android
            </Text>
            <View style={styles.pointsList}>
                {pontos.map((ponto, index) => (
                    <View key={index} style={styles.pointItem}>
                        <Text style={styles.pointTitle}>📍 {ponto.title}</Text>
                        <Text style={styles.pointDescription}>{ponto.description}</Text>
                        <Text style={styles.pointCoordinates}>
                            Coordenadas: {ponto.latitude.toFixed(5)}, {ponto.longitude.toFixed(5)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mapFallback: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
        backgroundColor: '#e5e7eb',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    fallbackText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 10,
        textAlign: 'center',
    },
    fallbackSubtext: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 20,
        textAlign: 'center',
    },
    pointsList: {
        width: '100%',
        maxHeight: '70%',
        overflow: 'scroll',
    },
    pointItem: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    pointTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e3a8a',
        marginBottom: 5,
    },
    pointDescription: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 5,
    },
    pointCoordinates: {
        fontSize: 12,
        color: '#9ca3af',
        fontStyle: 'italic',
    },
});

