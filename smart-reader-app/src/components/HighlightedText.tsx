import React from 'react';
import { Text } from 'react-native';

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
        return <Text style={baseStyle} numberOfLines={numberOfLines}>{text}</Text>;
    }
    return (
        <Text style={baseStyle} numberOfLines={numberOfLines}>
            {text.slice(0, start)}
            <Text style={{ backgroundColor: highlightBg, borderRadius: 2 }}>
                {text.slice(start, start + length)}
            </Text>
            {text.slice(start + length)}
        </Text>
    );
}
