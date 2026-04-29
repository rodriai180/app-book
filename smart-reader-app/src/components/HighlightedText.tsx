import React from 'react';
import { View, Text } from 'react-native';

interface Props {
    text: string;
    start: number;
    length: number;
    baseStyle: any;
    highlightBg: string;
    numberOfLines?: number;
}

export default function HighlightedText({ text, start, length, baseStyle, highlightBg, numberOfLines }: Props) {
    if (start < 0 || length <= 0 || start >= text.length) {
        return (
            <View style={{ overflow: 'visible' }}>
                <Text style={baseStyle} numberOfLines={numberOfLines}>{text}</Text>
            </View>
        );
    }
    return (
        <View style={{ overflow: 'visible' }}>
            <Text style={baseStyle} numberOfLines={numberOfLines}>
                {text.slice(0, start)}
                <Text style={{ backgroundColor: highlightBg, borderRadius: 2 }}>
                    {text.slice(start, start + length)}
                </Text>
                {text.slice(start + length)}
            </Text>
        </View>
    );
}
