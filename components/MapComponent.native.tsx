import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Alert, StyleSheet, View } from 'react-native';

interface Ponto {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    pinColor?: string;
}

interface MapComponentProps {
    pontos: Ponto[];
    style?: any;
}

export default function MapComponent({ pontos, style }: MapComponentProps) {
    return (
        <MapView
            style={[styles.map, style]}
            initialRegion={{
                latitude: -5.80079,
                longitude: -41.95145,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }}
        >
            {pontos.map((ponto, index) => (
                <Marker
                    key={index}
                    coordinate={{
                        latitude: ponto.latitude,
                        longitude: ponto.longitude,
                    }}
                    title={ponto.title}
                    description={ponto.description}
                    pinColor={ponto.pinColor || 'red'}
                    onPress={() => {
                        Alert.alert(ponto.title, ponto.description);
                    }}
                />
            ))}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});

