import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';

interface ReaderControlsProps {
    colors: any;
    isDark: boolean;
    isPlaying: boolean;
    currentPage: number;
    pages: string[];
    settings: any;
    handleTogglePlayback: () => void;
    handlePrevPage: () => void;
    handleNextPage: () => void;
}

export const ReaderControls = ({
    colors,
    isDark,
    isPlaying,
    currentPage,
    pages,
    settings,
    handleTogglePlayback,
    handlePrevPage,
    handleNextPage,
}: ReaderControlsProps) => {
    return (
        <View style={[styles.controlsContainer, {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
        }]}>
            <View style={styles.mainControls}>
                <TouchableOpacity
                    style={[styles.controlButton, currentPage === 0 && styles.disabledButton]}
                    onPress={handlePrevPage}
                    disabled={currentPage === 0}
                >
                    <SkipBack
                        size={20}
                        color={currentPage === 0 ? (isDark ? '#444' : '#C7C7CC') : colors.text}
                        fill={currentPage === 0 ? (isDark ? '#444' : '#C7C7CC') : colors.text}
                    />
                </TouchableOpacity>

                <View style={styles.centerGroup}>
                    <TouchableOpacity
                        style={[styles.playButton, { backgroundColor: colors.tint }]}
                        onPress={handleTogglePlayback}
                    >
                        {isPlaying ? (
                            <Pause size={18} color="#FFFFFF" fill="#FFFFFF" />
                        ) : (
                            <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                        )}
                    </TouchableOpacity>

                    <View style={[styles.speedBadge, { backgroundColor: colors.card }]}>
                        <Text style={[styles.speedText, { color: colors.secondaryText }]}>{settings.rate}x</Text>
                    </View>
                </View>

                <View style={styles.rightGroup}>
                    <View style={[styles.progressBadge, { backgroundColor: colors.card }]}>
                        <Text style={[styles.progressText, { color: colors.secondaryText }]}>
                            {pages.length > 0 ? Math.round(((currentPage + 1) / pages.length) * 100) : 0}%
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.controlButton, currentPage === pages.length - 1 && styles.disabledButton]}
                        onPress={handleNextPage}
                        disabled={currentPage === pages.length - 1}
                    >
                        <SkipForward
                            size={20}
                            color={currentPage === pages.length - 1 ? (isDark ? '#444' : '#C7C7CC') : colors.text}
                            fill={currentPage === pages.length - 1 ? (isDark ? '#444' : '#C7C7CC') : colors.text}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    controlsContainer: {
        paddingBottom: 16,
        paddingTop: 8,
        paddingHorizontal: 24,
        borderTopWidth: 1,
    },
    mainControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    centerGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 8,
    },
    speedBadge: {
        marginLeft: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    speedText: {
        fontSize: 13,
        fontWeight: '700',
    },
    rightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBadge: {
        marginRight: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    progressText: {
        fontSize: 13,
        fontWeight: '700',
    },
    controlButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
});
