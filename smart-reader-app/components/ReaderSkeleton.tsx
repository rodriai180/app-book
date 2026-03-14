import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Skeleton from './Skeleton';
import { useTheme } from '../src/services/themeContext';

export default function ReaderSkeleton() {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
            {/* Header Skeleton */}
            <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                <Skeleton width={30} height={30} borderRadius={15} />
                <Skeleton width="40%" height={20} />
                <Skeleton width={30} height={30} borderRadius={15} />
            </View>

            {/* Content Skeleton - Paragraphs */}
            <View style={styles.content}>
                {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={styles.paragraphContainer}>
                        <Skeleton width="100%" height={16} style={styles.line} />
                        <Skeleton width="100%" height={16} style={styles.line} />
                        <Skeleton width="90%" height={16} style={styles.line} />
                        <Skeleton width="95%" height={16} style={styles.line} />
                        <Skeleton width="40%" height={16} style={styles.lastLine} />
                    </View>
                ))}
            </View>

            {/* Bottom Controls Skeleton */}
            <View style={[styles.controls, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <View style={styles.controlRow}>
                    <Skeleton width={50} height={20} borderRadius={10} />
                    <Skeleton width={60} height={60} borderRadius={30} />
                    <Skeleton width={50} height={20} borderRadius={10} />
                </View>
                <Skeleton width="100%" height={4} style={styles.progress} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    paragraphContainer: {
        marginBottom: 32,
    },
    line: {
        marginBottom: 8,
    },
    lastLine: {
        marginBottom: 0,
    },
    controls: {
        height: 120,
        paddingHorizontal: 30,
        paddingTop: 10,
        borderTopWidth: 1,
        justifyContent: 'center',
    },
    controlRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    progress: {
        marginTop: 10,
    },
});
