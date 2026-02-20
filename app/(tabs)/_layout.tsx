import { Tabs } from 'expo-router'
import { Platform } from 'react-native'
import { Text } from 'react-native'

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0a0a0a',
                    borderTopColor: '#ffffff14',
                    borderTopWidth: 1,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
                    paddingTop: 8,
                    height: Platform.OS === 'ios' ? 80 : 60,
                },
                tabBarActiveTintColor: '#00E5FF',
                tabBarInactiveTintColor: '#ffffff44',
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    letterSpacing: 0.5,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '지도',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗺</Text>,
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: '인식',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎯</Text>,
                }}
            />
        </Tabs>
    )
}
