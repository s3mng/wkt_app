import React, { useRef, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps'
import { useLocation } from '../../src/hooks/useLocation'

const DELTA = 0.005  // ~500m zoom

export default function MapScreen() {
    const { location, hasPermission, error } = useLocation()
    const mapRef = useRef<MapView>(null)

    // Follow user location on first fix
    useEffect(() => {
        if (hasPermission) {
            mapRef.current?.animateToRegion(
                {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: DELTA,
                    longitudeDelta: DELTA,
                },
                800,
            )
        }
    }, [hasPermission])

    return (
        <View style={s.container}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
                customMapStyle={darkMapStyle}
                showsUserLocation
                showsMyLocationButton={false}
                followsUserLocation={false}
                showsCompass={false}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: DELTA,
                    longitudeDelta: DELTA,
                }}
            />

            {/* Center on me button */}
            <TouchableOpacity
                style={s.locBtn}
                onPress={() => {
                    mapRef.current?.animateToRegion(
                        {
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: DELTA,
                            longitudeDelta: DELTA,
                        },
                        500,
                    )
                }}
            >
                <Text style={s.locIcon}>◎</Text>
            </TouchableOpacity>

            {/* Coords HUD */}
            <View style={s.coordsBadge}>
                <Text style={s.coordsText}>
                    {location.latitude.toFixed(5)}°N {'  '}
                    {location.longitude.toFixed(5)}°E
                </Text>
            </View>

            {error && (
                <View style={s.errorBadge}>
                    <Text style={s.errorText}>{error}</Text>
                </View>
            )}
        </View>
    )
}

const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    locBtn: {
        position: 'absolute',
        bottom: 36,
        right: 20,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,229,255,0.15)',
        borderWidth: 1,
        borderColor: '#00E5FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    locIcon: { color: '#00E5FF', fontSize: 22 },
    coordsBadge: {
        position: 'absolute',
        bottom: 36,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffffff18',
    },
    coordsText: { color: '#ffffffcc', fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
    errorBadge: {
        position: 'absolute',
        top: 80,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,50,50,0.85)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    errorText: { color: '#fff', fontSize: 13 },
})

// Google Maps dark style
const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#16213e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f3460' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
    { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#16213e' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
    { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#334155' }] },
]
