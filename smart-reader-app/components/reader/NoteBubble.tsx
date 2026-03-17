import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, PanResponder } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface NoteBubbleProps {
    text: string;
    isDark: boolean;
    colors: any;
    onEdit: () => void;
    onDelete: () => void;
}

export const NoteBubble = ({ text, isDark, colors, onEdit, onDelete }: NoteBubbleProps) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx < 0) {
                    translateX.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx < -80) {
                    Animated.spring(translateX, {
                        toValue: -70,
                        useNativeDriver: true,
                    }).start();
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <View style={styles.noteWrapper}>
            <TouchableOpacity
                style={styles.deleteNoteAction}
                onPress={onDelete}
            >
                <Trash2 size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Animated.View
                {...panResponder.panHandlers}
                style={[
                    styles.noteContainer,
                    {
                        backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                        borderLeftColor: colors.tint,
                        transform: [{ translateX }]
                    }
                ]}
            >
                <TouchableOpacity onPress={onEdit} activeOpacity={0.8} style={styles.noteContentArea}>
                    <Text style={[styles.noteTextDisplay, { color: isDark ? '#E5E5EA' : '#3A3A3C' }]}>
                        {text}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    noteWrapper: {
        marginTop: 8,
        position: 'relative',
        justifyContent: 'center',
    },
    noteContainer: {
        padding: 12,
        borderRadius: 12,
        borderLeftWidth: 4,
        zIndex: 2,
    },
    noteContentArea: {
        width: '100%',
    },
    noteTextDisplay: {
        fontSize: 14,
        lineHeight: 20,
        fontStyle: 'italic',
    },
    deleteNoteAction: {
        position: 'absolute',
        right: 0,
        height: '100%',
        width: 70,
        backgroundColor: '#FF3B30',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
});
