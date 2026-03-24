import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MainTabParamList } from './types';
import PostcardPicksScreen from '../screens/PostcardPicksScreen';
import DartboardRoutesScreen from '../screens/DartboardRoutesScreen';
import PassportChallengeScreen from '../screens/PassportChallengeScreen';
import SketchAlongScreen from '../screens/SketchAlongScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS = {
  PostcardPicks: require('../assets/icons/postcard_picks.png'),
  DartboardRoutes: require('../assets/icons/dartboard_routes.png'),
  PassportChallenge: require('../assets/icons/passport_challenge.png'),
  SketchAlong: require('../assets/icons/sketch_along.png'),
  Settings: require('../assets/icons/settings.png'),
};

type RouteName = keyof typeof ICONS;

type TabIconProps = {
  focused: boolean;
  routeName: RouteName;
};

function TabIcon({ focused, routeName }: TabIconProps) {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width <= 375 || height <= 700;
  const iconSize = focused ? (isSmallScreen ? 24 : 26) : isSmallScreen ? 20 : 22;
  const wrapSize = focused ? (isSmallScreen ? 56 : 62) : isSmallScreen ? 40 : 46;
  const borderRadius = wrapSize / 2;

  return (
    <View
      style={[
        styles.iconWrap,
        {
          width: wrapSize,
          height: wrapSize,
          borderRadius,
          transform: [{ translateY: 15 }],
        },
        focused && styles.iconWrapActive,
      ]}
    >
      <Image
        source={ICONS[routeName]}
        resizeMode="contain"
        style={[
          styles.icon,
          {
            width: iconSize,
            height: iconSize,
          },
        ]}
      />
    </View>
  );
}

export default function MainTabNavigator() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width <= 375 || height <= 700;
  const tabBarHeight = isSmallScreen ? 66 : 74;
  const horizontalInset = isSmallScreen ? 18 : 28;

  const bottomInset =
    Platform.OS === 'ios'
      ? isSmallScreen
        ? 14
        : 24
      : isSmallScreen
      ? 40
      : 46;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          left: horizontalInset,
          right: horizontalInset,
          bottom: bottomInset,
          height: tabBarHeight,
          backgroundColor: '#001A73',
          borderTopWidth: 0,
          borderWidth: 1.5,
          borderColor: '#0B2A88',
          borderRadius: tabBarHeight / 2,
          paddingHorizontal: isSmallScreen ? 8 : 12,
          paddingTop: 0,
          paddingBottom: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            routeName={route.name as RouteName}
          />
        ),
      })}
    >
      <Tab.Screen
        name="PostcardPicks"
        component={PostcardPicksScreen}
        options={{ title: 'Postcard Picks' }}
      />
      <Tab.Screen
        name="DartboardRoutes"
        component={DartboardRoutesScreen}
        options={{ title: 'Dartboard Routes' }}
      />
      <Tab.Screen
        name="PassportChallenge"
        component={PassportChallengeScreen}
        options={{ title: 'Passport Challenge' }}
      />
      <Tab.Screen
        name="SketchAlong"
        component={SketchAlongScreen}
        options={{ title: 'Sketch Along' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#2E79FF',
    shadowColor: '#2E79FF',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  icon: {
    tintColor: '#FFFFFF',
  },
});