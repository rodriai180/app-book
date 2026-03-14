import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { useTheme } from '../services/themeContext';

interface CheckboxProps {
    checked: boolean;
    onToggle: () => void;
    label?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onToggle, label }) => {
    const { colors, isDark } = useTheme();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onToggle}
            activeOpacity={0.7}
        >
            <View style={[
                styles.checkbox,
                { borderColor: colors.secondaryText },
                checked && { backgroundColor: colors.tint, borderColor: colors.tint }
            ]}>
                {checked && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </View>
            {label && <View style={styles.labelContainer}>{label}</View>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    labelContainer: {
        flex: 1,
    },
});
