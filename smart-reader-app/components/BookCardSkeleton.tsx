import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';

export default function BookCardSkeleton() {
    return (
        <View style={styles.container}>
            <Skeleton width="100%" style={styles.cover} borderRadius={12} />
            <Skeleton width="80%" height={18} style={styles.title} />
            <Skeleton width="50%" height={14} style={styles.author} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 8,
        maxWidth: '46%',
    },
    cover: {
        aspectRatio: 2 / 3,
        marginBottom: 8,
    },
    title: {
        marginBottom: 6,
    },
    author: {
        marginBottom: 4,
    },
});
