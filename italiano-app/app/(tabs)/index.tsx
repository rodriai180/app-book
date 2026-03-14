import { useColorScheme } from '@/components/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Theme } from '@/constants/Theme';
import { Lesson } from '@/constants/mockData';
import { useAuth } from '@/services/authContext';
import { getLessons } from '@/services/firestoreService';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';



export default function Ruta8020Screen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    A1: true,
    A2: false,
    B1: false,
    B2: false,
    'C1/C2': false,
  });

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getLessons();
        const sortedData = data.sort((a, b) => Number(a.id) - Number(b.id));
        setLessons(sortedData);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const toggleSection = (level: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSections((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const renderLesson = ({ item }: { item: Lesson }) => (
    <Pressable
      key={item.id}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.primary },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => router.push({ pathname: '/clase', params: { lessonId: item.id, title: item.title, level: item.level } })}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {item.title}
        </Text>
        <ChevronRight size={20} color={theme.muted} />
      </View>
      <Text style={[styles.cardDescription, { color: theme.muted }]}>{item.description}</Text>
    </Pressable>
  );

  const renderSection = (title: string, subtitle: string, level: string) => {
    const sectionLessons = lessons.filter((l) => l.level === level);
    if (sectionLessons.length === 0 && !loading) return null;

    const isExpanded = expandedSections[level];

    return (
      <View key={level} style={styles.sectionContainer}>
        <Pressable
          onPress={() => toggleSection(level)}
          style={({ pressed }) => [
            styles.accordionHeader,
            { backgroundColor: theme.card, borderColor: theme.success, borderWidth: 3 },
            pressed && { opacity: 0.9 },
          ]}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 10, marginBottom: 4 }}>
              <Text style={[styles.accordionTitle, { color: theme.text, marginBottom: 0 }]}>{title}</Text>
              <View style={[styles.levelBadgeSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.levelBadgeText, { color: theme.primary }]}>{level}</Text>
              </View>
            </View>
            <Text style={[styles.accordionSubtitle, { color: theme.muted }]}>{subtitle}</Text>
          </View>
          <View
            style={[
              styles.chevronContainer,
              isExpanded && { transform: [{ rotate: '180deg' }] },
            ]}>
            <ChevronDown size={22} color={theme.text} />
          </View>
        </Pressable>

        {isExpanded && (
          <View style={styles.expandableContent}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              sectionLessons.map((item) => renderLesson({ item }))
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.listContent}>
        {loading && (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        )}
        {renderSection('Principiante (El "Sobreviviente")', 'Sobrevivir a un viaje a Italia', 'A1')}
        {renderSection('Elemental (El "Viajero")', 'Hablar de tu vida cotidiana y entorno', 'A2')}
        {renderSection('Intermedio (El "Independiente")', 'Contar historias y expresar planes', 'B1')}
        {renderSection('Avanzado (El "Fluido")', 'Argumentar, debatir y entender temas abstractos', 'B2')}
        {renderSection('Maestría (El "Nativo")', 'Matices, ironía y lenguaje culto', 'C1/C2')}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    marginBottom: Theme.spacing.sm,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
  sectionContainer: {
    gap: Theme.spacing.sm,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.lg,
    borderWidth: 1,
    ...Theme.shadows.light,
  },
  accordionTitle: {
    ...Theme.typography.h3,
    fontSize: 18,
    marginBottom: 2,
  },
  accordionSubtitle: {
    ...Theme.typography.body,
    fontSize: 13,
  },
  chevronContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8, // Bajar un poco la flecha para liberar espacio arriba
  },
  expandableContent: {
    gap: Theme.spacing.md,
    paddingLeft: Theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: '#E0E0E0',
    marginTop: Theme.spacing.xs,
  },
  card: {
    padding: Theme.spacing.md,
    borderRadius: Theme.roundness.lg,
    borderWidth: 1,
    ...Theme.shadows.light,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  levelBadgeSection: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: '#F3F4F6',
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardTitle: {
    ...Theme.typography.h3,
    fontSize: 18,
    marginBottom: 4,
  },
  cardDescription: {
    ...Theme.typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
});
