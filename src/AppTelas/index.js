import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet, Text } from 'react-native';

import AppCadastro from '../AppCadastro';
import AppLista from '../AppLista';


const { Navigator, Screen } = createBottomTabNavigator();

export default function AppTelas() {
  return (
    
    <NavigationContainer>
      <StatusBar style="light-content" />
      
      <Navigator
        screenOptions={{
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#fff",
          tabBarActiveBackgroundColor: "#E5E5E5",
          tabBarInactiveBackgroundColor: "#747373",
          tabBarLabelStyle: {
            fontSize: 20,
            position: 'absolute',
            top: 10,
            bottom: 0,
            left: 0,
            right: 0
          },
          tabBarIconStyle: {
            display: 'none'
          },
          
        }}
      >
        <Screen
          name="Agenda"
          component={AppLista}
          options={{ tabBarLabel: "AGENDA"}}
          
        />
        <Screen
          name="Cadastro"
          component={AppCadastro}
          options={{ tabBarLabel: "NOVO"}}
                    
        />
      </Navigator>

    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
