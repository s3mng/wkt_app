import { useEffect, useState } from 'react'
import * as Location from 'expo-location'
import type { GeoPoint } from '../types'

const DEFAULT_LOCATION: GeoPoint = {
    latitude: 37.5665,  // 서울 시청
    longitude: 126.978,
}

export function useLocation() {
    const [location, setLocation] = useState<GeoPoint>(DEFAULT_LOCATION)
    const [hasPermission, setHasPermission] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let sub: Location.LocationSubscription | null = null

            ; (async () => {
                const { status } = await Location.requestForegroundPermissionsAsync()
                if (status !== 'granted') {
                    setError('위치 권한이 거부됐습니다.')
                    return
                }
                setHasPermission(true)

                // High-accuracy streaming for latest devices
                sub = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 1000,
                        distanceInterval: 1,
                    },
                    (loc) => {
                        setLocation({
                            latitude: loc.coords.latitude,
                            longitude: loc.coords.longitude,
                        })
                    },
                )
            })()

        return () => {
            sub?.remove()
        }
    }, [])

    return { location, hasPermission, error }
}
