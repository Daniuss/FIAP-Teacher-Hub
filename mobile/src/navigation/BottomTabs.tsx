import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { colors, fonts } from '../theme/colors';
import AgendaScreen from '../screens/AgendaScreen';
import ChamadosScreen from '../screens/ChamadosScreen';
import ContatoScreen from '../screens/ContatoScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TurmasScreen from '../screens/TurmasScreen';

const Tab = createBottomTabNavigator();

const icons: Record<string, string> = {
  Início: 'home-outline',
  Agenda: 'calendar-outline',
  Turmas: 'school-outline',
  Contato: 'chatbubble-outline',
  Chamados: 'headset-outline',
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.fiap,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { borderTopWidth: 0.5, borderTopColor: colors.borderTertiary, backgroundColor: colors.backgroundPrimary },
        tabBarLabelStyle: { fontSize: 9, fontFamily: fonts.sansMedium },
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] as any} size={size ? 21 : 21} color={color} />,
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Turmas" component={TurmasScreen} />
      <Tab.Screen name="Contato" component={ContatoScreen} />
      <Tab.Screen name="Chamados" component={ChamadosScreen} />
    </Tab.Navigator>
  );
}
