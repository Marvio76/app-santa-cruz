import { useRouter } from 'expo-router';
import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

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
    const router = useRouter();

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
                    pinColor={ponto.pinColor || 'red'}
                    onPress={() => {
                        router.push({
                            pathname: `/local/${index}`,
                            params: {
                                ...ponto,
                                latitude: ponto.latitude.toString(),
                                longitude: ponto.longitude.toString(),
                            },
                        });
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

