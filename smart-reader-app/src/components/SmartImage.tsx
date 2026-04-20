import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import type { ViewStyle, ImageStyle } from 'react-native';

interface SmartImageProps {
    uri: string;
    style?: ViewStyle | ImageStyle;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
}

function isSvg(uri: string): boolean {
    const clean = uri.split('?')[0].toLowerCase();
    return clean.endsWith('.svg') || clean.includes('image/svg');
}

export default function SmartImage({ uri, style, resizeMode = 'cover' }: SmartImageProps) {
    if (isSvg(uri)) {
        return (
            <View style={[styles.webContainer, style as ViewStyle]}>
                <WebView
                    source={{ uri }}
                    style={styles.webview}
                    scrollEnabled={false}
                    scalesPageToFit
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    androidLayerType="software"
                    androidHardwareAccelerationDisabled
                />
            </View>
        );
    }

    return (
        <Image
            source={{ uri }}
            style={style as ImageStyle}
            resizeMode={resizeMode}
        />
    );
}

const styles = StyleSheet.create({
    webContainer: { overflow: 'hidden' },
    webview: { flex: 1, backgroundColor: 'transparent' },
});
