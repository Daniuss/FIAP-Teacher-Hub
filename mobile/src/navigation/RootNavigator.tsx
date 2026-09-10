import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useApp } from '../context/AppContext';
import LoginScreen from '../screens/LoginScreen';
import { colors } from '../theme/colors';
import BottomTabs from './BottomTabs';

export default function RootNavigator() {
  const { loggedIn, loading } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black }}>
        <ActivityIndicator color={colors.fiap} />
      </View>
    );
  }

  return <NavigationContainer>{loggedIn ? <BottomTabs /> : <LoginScreen />}</NavigationContainer>;
}
