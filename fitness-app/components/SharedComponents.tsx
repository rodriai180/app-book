import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const Card = ({ children, style }: CardProps) => {
    const colorScheme = useColorScheme();
    return (
        <View style={[
            styles.card,
            { backgroundColor: Colors[colorScheme ?? 'light'].background, borderColor: Colors[colorScheme ?? 'light'].tabIconDefault },
            style
        ]}>
            {children}
        </View>
    );
};

interface ButtonProps {
    onPress: () => void;
    title: string;
    style?: ViewStyle;
    variant?: 'primary' | 'secondary';
}

export const Button = ({ onPress, title, style, variant = 'primary' }: ButtonProps) => {
    const colorScheme = useColorScheme();
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
                style
            ]}
        >
            <Text style={[
                styles.buttonText,
                { color: isPrimary ? '#fff' : Colors[colorScheme ?? 'light'].tint }
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 0.5,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPrimary: {
        backgroundColor: '#2f95dc',
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#2f95dc',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
