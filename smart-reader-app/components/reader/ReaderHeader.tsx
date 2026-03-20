import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated } from 'react-native';
import { ArrowLeft, Search, X, ChevronUp, ChevronDown, FileText } from 'lucide-react-native';

interface ReaderHeaderProps {
    colors: any;
    isDark: boolean;
    headerAnim: Animated.Value;
    searchVisible: boolean;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    matches: any[];
    currentMatchIndex: number;
    searchInputRef: React.RefObject<TextInput>;
    toggleSearch: () => void;
    goToPrevMatch: () => void;
    goToNextMatch: () => void;
    onBack: () => void;
    showSearch?: boolean;
    hasPdf?: boolean;
    onTogglePdf?: () => void;
}

export const ReaderHeader = ({
    colors,
    isDark,
    headerAnim,
    searchVisible,
    searchQuery,
    setSearchQuery,
    matches,
    currentMatchIndex,
    searchInputRef,
    toggleSearch,
    goToPrevMatch,
    goToNextMatch,
    showSearch = true,
    onBack,
    hasPdf,
    onTogglePdf,
}: ReaderHeaderProps) => {
    return (
        <Animated.View style={[
            styles.headerRow,
            {
                backgroundColor: isDark ? 'rgba(28,28,30,0.95)' : 'rgba(253,253,253,0.95)',
                borderBottomColor: colors.border,
                opacity: headerAnim,
                maxHeight: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 60],
                }),
                overflow: 'hidden' as const,
            },
        ]}>
            <TouchableOpacity
                onPress={onBack}
                style={[styles.headerButton, { backgroundColor: colors.card }]}
            >
                <ArrowLeft size={24} color={colors.secondaryText} />
            </TouchableOpacity>

            {searchVisible && (
                <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
                    <Search size={16} color={colors.secondaryText} />
                    <TextInput
                        ref={searchInputRef}
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Buscar en el libro..."
                        placeholderTextColor={isDark ? '#555' : '#C7C7CC'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCorrect={false}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <View style={styles.searchActions}>
                            <Text style={[styles.matchCounter, { color: colors.secondaryText }]}>
                                {matches.length > 0
                                    ? `${currentMatchIndex + 1}/${matches.length}`
                                    : '0/0'}
                            </Text>
                            <TouchableOpacity
                                onPress={goToPrevMatch}
                                style={[styles.navButton, matches.length === 0 && styles.navButtonDisabled]}
                                disabled={matches.length === 0}
                            >
                                <ChevronUp size={18} color={matches.length > 0 ? colors.tint : (isDark ? '#444' : '#C7C7CC')} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={goToNextMatch}
                                style={[styles.navButton, matches.length === 0 && styles.navButtonDisabled]}
                                disabled={matches.length === 0}
                            >
                                <ChevronDown size={18} color={matches.length > 0 ? colors.tint : (isDark ? '#444' : '#C7C7CC')} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {hasPdf && !searchVisible && (
                <TouchableOpacity
                    onPress={onTogglePdf}
                    style={[styles.headerButton, { backgroundColor: colors.card }]}
                >
                    <FileText size={20} color={colors.secondaryText} />
                </TouchableOpacity>
            )}

            {showSearch && (
                <TouchableOpacity
                    onPress={toggleSearch}
                    style={[styles.headerButton, { backgroundColor: colors.card }]}
                >
                    {searchVisible ? (
                        <X size={22} color={colors.tint} />
                    ) : (
                        <Search size={22} color={colors.secondaryText} />
                    )}
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 60,
        borderBottomWidth: 1,
        zIndex: 10,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 12,
        marginHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        marginLeft: 8,
        height: '100%',
    },
    searchActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    matchCounter: {
        fontSize: 12,
        marginHorizontal: 8,
        fontWeight: '600',
    },
    navButton: {
        padding: 4,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
});
