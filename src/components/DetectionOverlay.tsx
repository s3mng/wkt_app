import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSharedValue, useDerivedValue } from 'react-native-worklets-core'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import type { Detection } from '../types'

interface Props {
    detections: ReturnType<typeof useSharedValue<Detection[]>>
    frameWidth: number
    frameHeight: number
}

const LABEL_COLORS = [
    '#00E5FF', '#76FF03', '#FF6D00', '#D500F9',
    '#FF1744', '#FFEA00', '#00E676', '#2979FF',
]

function labelColor(label: string) {
    let hash = 0
    for (let i = 0; i < label.length; i++) hash = label.charCodeAt(i) + hash * 31
    return LABEL_COLORS[Math.abs(hash) % LABEL_COLORS.length]
}

function DetectionBox({ det, color }: { det: Detection; color: string }) {
    const style = useAnimatedStyle(() => ({
        position: 'absolute',
        left: `${det.bbox.x * 100}%`,
        top: `${det.bbox.y * 100}%`,
        width: `${det.bbox.width * 100}%`,
        height: `${det.bbox.height * 100}%`,
        borderColor: color,
        borderWidth: 2,
        borderRadius: 4,
    }))

    return (
        <Animated.View style={style}>
            <View style={[s.labelBg, { backgroundColor: color }]}>
                <Text style={s.labelText}>
                    {det.label} {(det.confidence * 100).toFixed(0)}%
                </Text>
            </View>
        </Animated.View>
    )
}

export function DetectionOverlay({ detections }: Props) {
    const currentDetections = useDerivedValue(() => detections.value)

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {currentDetections.value.map((det, i) => (
                <DetectionBox key={`${det.label}-${i}`} det={det} color={labelColor(det.label)} />
            ))}
        </View>
    )
}

const s = StyleSheet.create({
    labelBg: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: -22,
    },
    labelText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '700',
    },
})
