import React, { useState, useRef } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native'
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from 'react-native-vision-camera'
import { useObjectDetection } from '../../src/hooks/useObjectDetection'
import { DetectionOverlay } from '../../src/components/DetectionOverlay'

export default function CameraScreen() {
    const { hasPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice('back', {
        physicalDevices: ['ultra-wide-angle-camera', 'wide-angle-camera', 'telephoto-camera'],
    })

    const { isReady, detections, frameProcessor, modelState } = useObjectDetection()

    const [frameSize, setFrameSize] = useState({ width: 1, height: 1 })

    // ── Permission gate ────────────────────────────────────────────────────────
    if (!hasPermission) {
        return (
            <View style={s.center}>
                <Text style={s.permText}>카메라 권한이 필요합니다</Text>
                <TouchableOpacity style={s.btn} onPress={requestPermission}>
                    <Text style={s.btnText}>권한 허용</Text>
                </TouchableOpacity>
            </View>
        )
    }

    if (!device) {
        return (
            <View style={s.center}>
                <Text style={s.permText}>카메라를 찾을 수 없습니다</Text>
            </View>
        )
    }

    return (
        <View style={s.container}>
            {/* Camera */}
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive
                frameProcessor={isReady ? frameProcessor : undefined}
                pixelFormat="rgb"
                onLayout={(e) =>
                    setFrameSize({
                        width: e.nativeEvent.layout.width,
                        height: e.nativeEvent.layout.height,
                    })
                }
            />

            {/* Detection bounding boxes */}
            {isReady && (
                <DetectionOverlay
                    detections={detections}
                    frameWidth={frameSize.width}
                    frameHeight={frameSize.height}
                />
            )}

            {/* Model loading indicator */}
            {!isReady && (
                <View style={s.loadingBadge}>
                    <ActivityIndicator color="#00E5FF" size="small" />
                    <Text style={s.loadingText}>
                        {modelState === 'loading' ? '모델 로딩 중...' : `모델 상태: ${modelState}`}
                    </Text>
                </View>
            )}

            {/* HUD */}
            <View style={s.hud} pointerEvents="none">
                <View style={s.corner} />
                <View style={[s.corner, s.cornerTR]} />
                <View style={[s.corner, s.cornerBL]} />
                <View style={[s.corner, s.cornerBR]} />
            </View>

            {/* Status bar */}
            <View style={s.statusBar}>
                <View style={[s.dot, { backgroundColor: isReady ? '#00E676' : '#FF6D00' }]} />
                <Text style={s.statusText}>
                    {isReady ? 'LIVE' : 'LOADING'}
                </Text>
            </View>
        </View>
    )
}

const CORNER_SIZE = 20
const CORNER_THICK = 3

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    center: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    permText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    btn: {
        backgroundColor: '#00E5FF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    btnText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 15,
    },
    loadingBadge: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#00E5FF33',
    },
    loadingText: {
        color: '#00E5FF',
        fontSize: 13,
        fontWeight: '600',
    },
    hud: {
        ...StyleSheet.absoluteFillObject,
        margin: 48,
    },
    corner: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderTopWidth: CORNER_THICK,
        borderLeftWidth: CORNER_THICK,
        borderColor: '#00E5FF',
        borderRadius: 3,
    },
    cornerTR: { left: undefined, right: 0, borderLeftWidth: 0, borderRightWidth: CORNER_THICK },
    cornerBL: { top: undefined, bottom: 0, borderTopWidth: 0, borderBottomWidth: CORNER_THICK },
    cornerBR: {
        top: undefined, left: undefined,
        bottom: 0, right: 0,
        borderTopWidth: 0, borderLeftWidth: 0,
        borderBottomWidth: CORNER_THICK, borderRightWidth: CORNER_THICK,
    },
    statusBar: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
    },
})
