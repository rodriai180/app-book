import { useState } from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Platform } from 'react-native';
import { Book, Menu, Compass, BookOpen } from 'lucide-react-native';
import SideMenu from '../../components/SideMenu';
import { useTheme } from '../../src/services/themeContext';

export default function TabLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const { colors } = useTheme();

    const MenuButton = () => (
        <TouchableOpacity onPress={toggleMenu} style={{ paddingLeft: 16 }}>
            <Menu size={24} color={colors.text} />
        </TouchableOpacity>
    );

    const CustomTabBar = ({ state, descriptors, navigation }: any) => (
        <View style={{
            flexDirection: 'row',
            height: 60,
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        activeOpacity={0.7}
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}
                    >
                        {options.tabBarIcon && options.tabBarIcon({
                            focused: isFocused,
                            color: isFocused ? colors.tint : colors.secondaryText,
                            size: 32
                        })}
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View 
                style={{ flex: 1 }}
                {...(isMenuOpen && Platform.OS === 'web' ? { 
                    'aria-hidden': true,
                    // Use dataSet for inert as it's not a standard RN prop
                    dataSet: { inert: '' } 
                } : {})}
            >
                <Tabs
                    tabBar={(props) => <CustomTabBar {...props} />}
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: colors.background,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                            elevation: 0,
                            shadowOpacity: 0,
                        },
                        headerTitleStyle: {
                            fontWeight: '700',
                            fontSize: 20,
                            color: colors.text,
                        },
                        headerLeft: () => <MenuButton />,
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Mi Biblioteca',
                            tabBarIcon: ({ color }) => <Book size={32} color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="summaries"
                        options={{
                            title: 'Descubrir',
                            tabBarIcon: ({ color }) => <Compass size={32} color={color} />,
                        }}
                    />
                    <Tabs.Screen
                        name="resumenes"
                        options={{
                            title: 'Resúmenes',
                            tabBarIcon: ({ color }) => <BookOpen size={32} color={color} />,
                        }}
                    />
                  
                </Tabs>
            </View>

            {/* Side Menu overlay */}
            {isMenuOpen && <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
        </View>
    );
}
