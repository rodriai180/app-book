import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import HighlightedText from './HighlightedText';
import { LinearGradient } from 'expo-linear-gradient';
import {
    MessageSquare, Brain, Briefcase, Star, Building2,
    Users, Zap, BookOpen, Repeat2,
    Clock, Heart, Lightbulb, Target, TrendingUp,
    Flame, Shield, Award, Eye, DollarSign,
    Handshake, Compass, Smile, CheckCircle, Lock,
} from 'lucide-react-native';

// ─── Mapeo de categorías → gradientes ────────────────────────────────────────

const CATEGORY_GRADIENTS: Record<string, readonly [string, string]> = {
    'comunicacion':        ['#6C63FF', '#3F3D9E'],
    'psicologia':          ['#E91E63', '#9C27B0'],
    'negocios':            ['#FF9800', '#F44336'],
    'desarrollo-personal': ['#4CAF50', '#2E7D32'],
    'finanzas':            ['#00BCD4', '#006064'],
    'liderazgo':           ['#FFC107', '#FF6F00'],
    'habitos':             ['#26C6DA', '#00838F'],
    'productividad':       ['#7C4DFF', '#304FFE'],
};

const DEFAULT_GRADIENT: readonly [string, string] = ['#546E7A', '#263238'];

// ─── 4 direcciones posibles del gradiente principal ──────────────────────────
// La semilla elige cuál → mismo ML siempre tiene la misma dirección.

const GRADIENT_DIRS: Array<{ start: { x: number; y: number }; end: { x: number; y: number } }> = [
    { start: { x: 0,   y: 0   }, end: { x: 1,   y: 1   } }, // diagonal ↘
    { start: { x: 1,   y: 0   }, end: { x: 0,   y: 1   } }, // diagonal ↙
    { start: { x: 0,   y: 0   }, end: { x: 1,   y: 0   } }, // horizontal →
    { start: { x: 0,   y: 0   }, end: { x: 0,   y: 1   } }, // vertical ↓
];

// ─── Mapeo de categorías → ícono ─────────────────────────────────────────────

type IconComponent = React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;

const CATEGORY_ICONS: Record<string, IconComponent> = {
    'comunicacion':        MessageSquare,
    'psicologia':          Brain,
    'negocios':            Briefcase,
    'desarrollo-personal': Star,
    'finanzas':            Building2,
    'liderazgo':           Users,
    'habitos':             Repeat2,
    'productividad':       Zap,
};

const DEFAULT_ICON: IconComponent = BookOpen;

// ─── Tags → ícono específico ──────────────────────────────────────────────────
// Si algún tag del ML coincide con una keyword, se usa ese ícono más específico
// en lugar del genérico de categoría. El primero que matchea gana.

const TAG_ICON_MAP: Array<{ keywords: string[]; icon: IconComponent }> = [
    { keywords: ['foco', 'focus', 'concentracion', 'concentración', 'atencion', 'atención'],    icon: Target },
    { keywords: ['memoria', 'aprendizaje', 'aprender', 'estudio', 'conocimiento'],              icon: Brain },
    { keywords: ['tiempo', 'gestion del tiempo', 'productividad', 'eficiencia'],                icon: Clock },
    { keywords: ['motivacion', 'motivación', 'energia', 'energía', 'impulso', 'drive'],         icon: Flame },
    { keywords: ['habito', 'hábito', 'rutina', 'disciplina', 'constancia'],                     icon: Repeat2 },
    { keywords: ['comunicacion', 'comunicación', 'hablar', 'escuchar', 'dialogo', 'diálogo'],   icon: MessageSquare },
    { keywords: ['liderazgo', 'equipo', 'team', 'colaboracion', 'colaboración'],                icon: Users },
    { keywords: ['ventas', 'negociacion', 'negociación', 'persuasion', 'persuasión'],           icon: Handshake },
    { keywords: ['dinero', 'finanzas', 'inversion', 'inversión', 'ahorro', 'riqueza'],          icon: DollarSign },
    { keywords: ['crecimiento', 'mejora', 'progreso', 'avance', 'resultados'],                  icon: TrendingUp },
    { keywords: ['bienestar', 'salud', 'autocuidado', 'mindfulness', 'meditacion'],             icon: Heart },
    { keywords: ['creatividad', 'innovacion', 'innovación', 'ideas', 'solucion'],               icon: Lightbulb },
    { keywords: ['proposito', 'propósito', 'mision', 'misión', 'vision', 'meta', 'objetivo'],   icon: Compass },
    { keywords: ['confianza', 'autoestima', 'seguridad', 'actitud', 'mentalidad'],              icon: Shield },
    { keywords: ['logro', 'exito', 'éxito', 'alcanzar', 'ganar', 'premio'],                     icon: Award },
    { keywords: ['decision', 'decisión', 'claridad', 'perspectiva', 'reflexion'],               icon: Eye },
    { keywords: ['felicidad', 'alegria', 'alegría', 'positividad', 'gratitud'],                 icon: Smile },
    { keywords: ['accion', 'acción', 'ejecutar', 'implementar', 'hacer', 'practica'],           icon: CheckCircle },
    { keywords: ['limites', 'límites', 'barreras', 'miedos', 'creencias'],                      icon: Lock },
    { keywords: ['negocio', 'empresa', 'emprender', 'startup', 'estrategia'],                   icon: Briefcase },
];

function normalize(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

/**
 * Busca en los tags del ML si alguno matchea una keyword del mapa.
 * Si encuentra → devuelve ese ícono específico.
 * Si no → devuelve el ícono genérico de categoría.
 */
function getIconFromTags(tags: string[], category?: string): IconComponent {
    const normalizedTags = tags.map(normalize);

    for (const { keywords, icon } of TAG_ICON_MAP) {
        const normalizedKeywords = keywords.map(normalize);
        const matches = normalizedTags.some(tag =>
            normalizedKeywords.some(kw => tag.includes(kw) || kw.includes(tag))
        );
        if (matches) return icon;
    }

    // Fallback al ícono de categoría
    return getIcon(category);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeCategory(category?: string): string {
    if (!category) return '';
    return category
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
}

function getGradient(category?: string): readonly [string, string] {
    const key = normalizeCategory(category);
    return CATEGORY_GRADIENTS[key] ?? DEFAULT_GRADIENT;
}

function getIcon(category?: string): IconComponent {
    const key = normalizeCategory(category);
    return CATEGORY_ICONS[key] ?? DEFAULT_ICON;
}

function hashString(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return Math.abs(h);
}

function getVisualSeed(tags: string[]): number {
    return hashString(tags.join('|'));
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GeneratedCoverProps {
    title: string;
    type: 'chapter' | 'microlearning' | 'book';
    category?: string;
    author?: string;
    chapterNumber?: number;
    tags?: string[];
    content?: string;
    reflectionQuestion?: string;
    titleHighlight?: { start: number; length: number };
    contentHighlight?: { start: number; length: number };
    questionHighlight?: { start: number; length: number };
    hideTags?: boolean;
    hideText?: boolean;
    width?: number | string;
    height?: number;
    style?: ViewStyle;
    large?: boolean;
    grow?: boolean;
}

// ─── Decoraciones geométricas de fondo ───────────────────────────────────────

function MicroDecoration({ seed }: { seed: number }) {
    const variant = seed % 4;

    if (variant === 0) {
        return (
            <>
                <View style={[deco.band, { top: '15%', transform: [{ rotate: '-25deg' }] }]} />
                <View style={[deco.band, { top: '50%', transform: [{ rotate: '-25deg' }], opacity: 0.05 }]} />
                <View style={[deco.circle, { width: 80, height: 80, bottom: -30, right: -20 }]} />
            </>
        );
    }
    if (variant === 1) {
        return (
            <>
                <View style={[deco.ring, { width: 140, height: 140, bottom: -50, left: -50 }]} />
                <View style={[deco.ring, { width: 90,  height: 90,  bottom: -20, left: -20 }]} />
                <View style={[deco.circle, { width: 50, height: 50, top: 16, right: 20 }]} />
            </>
        );
    }
    if (variant === 2) {
        return (
            <>
                <View style={deco.triangle} />
                <View style={[deco.circle, { width: 100, height: 100, top: -30, right: -30 }]} />
                <View style={[deco.circle, { width: 40,  height: 40,  bottom: 20, left: 30 }]} />
            </>
        );
    }
    return (
        <>
            <View style={[deco.square, { width: 90, height: 90, bottom: -30, right: -20, transform: [{ rotate: '20deg' }] }]} />
            <View style={[deco.square, { width: 50, height: 50, top: 10,   left: 10,  transform: [{ rotate: '35deg' }] }]} />
            <View style={[deco.circle, { width: 60, height: 60, bottom: 10, left: -10 }]} />
        </>
    );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function GeneratedCover({
    title,
    type,
    category,
    author,
    chapterNumber,
    tags = [],
    content,
    reflectionQuestion,
    titleHighlight,
    contentHighlight,
    questionHighlight,
    hideTags = false,
    hideText = false,
    width = '100%',
    height,
    style,
    large = false,
    grow = false,
}: GeneratedCoverProps) {
    const resolvedHeight = height ?? (type === 'chapter' ? 200 : type === 'book' ? 280 : 150);
    const gradient      = getGradient(category);
    const Icon          = type === 'microlearning'
                            ? getIconFromTags(tags, category)
                            : getIcon(category);
    const seed          = getVisualSeed(tags.length > 0 ? tags : [title]);
    const gradientDir   = GRADIENT_DIRS[seed % 4];
    // 3 formas posibles del contenedor del ícono: 0=círculo, 1=cuadrado redondeado, 2=diamante
    const iconShape     = seed % 3;

    const hasAspectRatio = style && 'aspectRatio' in style;
    const hasFlex = style && ('flex' in style || 'flexGrow' in style);
    const needsFixedHeight = !grow && !hasAspectRatio && !hasFlex;
    const containerStyle = [
        styles.container,
        { width: width as any, ...(needsFixedHeight ? { height: resolvedHeight } : {}) },
        style ?? {},
    ];

    const bgLetter   = (tags[0] ?? title).charAt(0).toUpperCase();
    const visibleTags = hideTags ? [] : tags.slice(0, 3);
    const showText    = !hideText;

    // ── Microlearning ──────────────────────────────────────────────────────────
    if (type === 'microlearning') {
        return (
            <LinearGradient
                colors={gradient as [string, string]}
                start={gradientDir.start}
                end={gradientDir.end}
                style={containerStyle}
            >
                {/* 1. Decoración geométrica variable */}
                <MicroDecoration seed={seed} />

                {/* 2. Letra gigante de fondo */}
                <Text style={styles.bgLetter} numberOfLines={1}>{bgLetter}</Text>

                {/* 3. Icono + glow centrados */}
                <View style={[
                    styles.mlContent,
                    content ? { justifyContent: 'flex-start' } : null,
                    grow ? { flex: 0, paddingTop: 64, paddingBottom: 72 } : null,
                ]}>
                    <View style={styles.iconWrapper}>
                        <View style={styles.iconGlow} />
                        <View style={[
                            styles.iconOuterRing,
                            iconShape === 1 && styles.iconOuterSquare,
                            iconShape === 2 && styles.iconOuterDiamond,
                        ]}>
                            <View style={[
                                styles.iconInnerCircle,
                                iconShape === 1 && styles.iconInnerSquare,
                                iconShape === 2 && styles.iconInnerDiamond,
                            ]}>
                                <Icon
                                    size={32}
                                    color="#FFFFFF"
                                    strokeWidth={1.5}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Título */}
                    {showText && (
                        <HighlightedText
                            text={title}
                            start={titleHighlight?.start ?? -1}
                            length={titleHighlight?.length ?? 0}
                            baseStyle={styles.mlTitle}
                            highlightBg="rgba(255,255,255,0.35)"
                            numberOfLines={2}
                        />
                    )}

                    {/* Contenido y pregunta de reflexión */}
                    {showText && content && (
                        <HighlightedText
                            text={content}
                            start={contentHighlight?.start ?? -1}
                            length={contentHighlight?.length ?? 0}
                            baseStyle={styles.mlBodyText}
                            highlightBg="rgba(255,255,255,0.35)"
                        />
                    )}
                    {showText && reflectionQuestion && (
                        <HighlightedText
                            text={reflectionQuestion}
                            start={questionHighlight?.start ?? -1}
                            length={questionHighlight?.length ?? 0}
                            baseStyle={styles.mlReflectionText}
                            highlightBg="rgba(255,255,255,0.35)"
                        />
                    )}

                </View>
            </LinearGradient>
        );
    }
    // ── Book ───────────────────────────────────────────────────────────────────
    if (type === 'book') {
        return (
            <LinearGradient
                colors={gradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={containerStyle}
            >
                {/* Círculos decorativos sutiles */}
                <View style={[deco.circle, { width: '120%', height: '50%', bottom: '-20%', right: '-20%', borderRadius: 999 }]} />
                <View style={[deco.ring,   { width: '70%',  height: '35%', top: '-10%',   left: '-15%',  borderRadius: 999 }]} />

                <View style={styles.bookContent}>
                    {showText && (
                        <View style={styles.bookTextContainer}>
                            <Text
                                style={[styles.bookTitle, large && styles.bookTitleLarge]}
                                numberOfLines={4}
                                ellipsizeMode="tail"
                                adjustsFontSizeToFit
                                minimumFontScale={0.6}
                            >
                                {title}
                            </Text>
                            <View style={styles.bookDivider} />
                            {author && (
                                <Text
                                    style={[styles.bookAuthor, large && styles.bookAuthorLarge]}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                    adjustsFontSizeToFit
                                    minimumFontScale={0.7}
                                >
                                    {author}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </LinearGradient>
        );
    }
    // ── Chapter ────────────────────────────────────────────────────────────────
    return (
        <LinearGradient
            colors={gradient as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={containerStyle}
        >
            <View style={[deco.circle, { width: 180, height: 180, bottom: -60, right: -40 }]} />
            <View style={[deco.circle, { width: 100, height: 100, top: -20,   left: -20  }]} />
            <View style={[deco.circle, { width: 60,  height: 60,  top: '40%', right: 20  }]} />

            <View style={styles.chapterContent}>
                {chapterNumber != null && (
                    <Text style={styles.chapterLabel}>Capítulo {chapterNumber}</Text>
                )}

                <View style={styles.iconWrapper}>
                    <View style={styles.iconGlow} />
                    <View style={styles.iconOuterRing}>
                        <View style={styles.iconInnerCircle}>
                            <Icon size={32} color="#FFFFFF" strokeWidth={1.5} />
                        </View>
                    </View>
                </View>

                <Text style={styles.chapterTitle} numberOfLines={2}>{title}</Text>
            </View>
        </LinearGradient>
    );
}

// ─── Estilos de decoraciones ──────────────────────────────────────────────────

const deco = StyleSheet.create({
    circle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.09)',
    },
    ring: {
        position: 'absolute',
        borderRadius: 999,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    band: {
        position: 'absolute',
        width: '160%',
        height: 36,
        left: '-30%',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    triangle: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        width: 0,
        height: 0,
        borderLeftWidth: 80,
        borderLeftColor: 'transparent',
        borderBottomWidth: 100,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    square: {
        position: 'absolute',
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
});

// ─── Estilos principales ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },

    // ── Fondo ─────────────────────────────────────────────────────────────────

    bgLetter: {
        position: 'absolute',
        fontSize: 160,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.07)',
        bottom: -30,
        right: -10,
        lineHeight: 180,
    },

    // Círculo grande translúcido que simula una fuente de luz detrás del ícono
    iconGlow: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: 'rgba(255,255,255,0.1)',
        top: 0,
        left: 0,
    },

    iconWrapper: {
        width: 130,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    // Gradiente transparente→oscuro en la parte baja
    bottomFade: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 70,
    },

    // ── Microlearning ──────────────────────────────────────────────────────────

    mlContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 10,
    },

    // Anillo exterior
    iconOuterRing: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.35)',
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 14,
        elevation: 8,
    },
    // Círculo interior
    iconInnerCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Forma 1: cuadrado redondeado (override de borderRadius)
    iconOuterSquare: { borderRadius: 18 },
    iconInnerSquare: { borderRadius: 12 },

    // Forma 2: diamante (cuadrado rotado 45°, ícono contra-rotado)
    iconOuterDiamond: { borderRadius: 14, transform: [{ rotate: '45deg' }] },
    iconInnerDiamond: { borderRadius: 8,  transform: [{ rotate: '-45deg' }] },

    mlTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
        lineHeight: 21,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
    },

    mlBodyText: {
        fontSize: 12,
        fontWeight: '400',
        color: 'rgba(255,255,255,0.88)',
        lineHeight: 18,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },

    mlReflectionText: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },

    // Línea separadora entre contenido y tags
    separator: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 1,
        marginTop: 10,
        marginBottom: -2,
    },

    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 6,
    },
    tagChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    // Punto de color antes del texto del tag
    tagDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    tagText: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: 0.3,
    },

    // ── Chapter ────────────────────────────────────────────────────────────────

    chapterContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        gap: 10,
    },
    chapterLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    chapterTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
        textShadowColor: 'rgba(0,0,0,0.35)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },

    // ── Book ───────────────────────────────────────────────────────────────────

    bookContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },

    bookTextContainer: {
        alignItems: 'center',
        gap: 6,
        width: '100%',
    },

    bookTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 17,
        letterSpacing: 0.1,
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
    },

    bookDivider: {
        width: 28,
        height: 1.5,
        borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.45)',
    },

    bookAuthor: {
        fontSize: 10,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        letterSpacing: 0.3,
        lineHeight: 14,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    bookTitleLarge: {
        fontSize: 20,
        lineHeight: 26,
        letterSpacing: 0.3,
    },
    bookAuthorLarge: {
        fontSize: 14,
        lineHeight: 19,
        letterSpacing: 0.5,
    },
});
