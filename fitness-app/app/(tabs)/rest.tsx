import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@/components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { Button } from '@/components/SharedComponents';

export default function DescansoScreen() {
    const [timeLeft, setTimeLeft] = useState(90); // Default 90s
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            Alert.alert('¡Tiempo cumplido!', 'Es hora de tu siguiente serie.');
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(90);
    };

    const adjustTime = (amount: number) => {
        setTimeLeft((prev) => Math.max(0, prev + amount));
    };

    const setPreset = (seconds: number) => {
        setIsActive(false);
        setTimeLeft(seconds);
    };

    return (
        <View style={styles.container}>
            <View style={styles.timerCircle}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <Text style={styles.timerLabel}>TIEMPO DE DESCANSO</Text>
            </View>

            <View style={styles.controlsRow}>
                <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTime(-30)}>
                    <Text style={styles.adjustButtonText}>-30s</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mainControlButton} onPress={toggleTimer}>
                    <FontAwesome name={isActive ? "pause" : "play"} size={30} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.adjustButton} onPress={() => adjustTime(30)}>
                    <Text style={styles.adjustButtonText}>+30s</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.quickSelectGrid}>
                {[30, 60, 90, 120, 180].map((seconds) => (
                    <Button
                        key={seconds}
                        title={seconds < 60 ? `${seconds}s` : `${seconds / 60}m`}
                        onPress={() => setPreset(seconds)}
                        variant="secondary"
                        style={styles.quickSelectBtn}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
                <Text style={styles.resetButtonText}>REINICIAR</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    timerCircle: {
        width: 250,
        height: 250,
        borderRadius: 125,
        borderWidth: 8,
        borderColor: '#2f95dc',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    timerText: {
        fontSize: 60,
        fontWeight: 'bold',
    },
    timerLabel: {
        fontSize: 12,
        opacity: 0.5,
        marginTop: 8,
    },
    controlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    mainControlButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2f95dc',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    adjustButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adjustButtonText: {
        fontWeight: 'bold',
        opacity: 0.7,
    },
    quickSelectGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    quickSelectBtn: {
        width: '40%',
        margin: 8,
    },
    resetButton: {
        marginTop: 20,
    },
    resetButtonText: {
        color: '#ff4444',
        fontWeight: 'bold',
        opacity: 0.8,
    },
});
