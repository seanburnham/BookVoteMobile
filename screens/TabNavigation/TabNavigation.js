import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { GroupsScreen, HomeScreen, ProfileScreen } from '../../screens'
import {decode, encode} from 'base-64'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Tab = createMaterialBottomTabNavigator()

export default function TabNavigation() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#fb5b5a"
        inactiveColor="white"
        barStyle={{ backgroundColor: '#465881' }}
      >
        <Tab.Screen 
            name='Home' 
            component={HomeScreen} 
            options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
        />
        <Tab.Screen 
            name='Groups' 
            component={GroupsScreen} 
            options={{
                tabBarLabel: 'Groups',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account-group" color={color} size={26} />
                ),
              }}
        />
        <Tab.Screen 
            name='Profile' 
            component={ProfileScreen} 
            options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={26} />
                ),
              }}
        />
      </Tab.Navigator>
    )
  }