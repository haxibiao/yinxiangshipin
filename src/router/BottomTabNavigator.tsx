import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@src/screens/home';
import Find from '@src/screens/find';
import Task from '@src/screens/task';
import Notification from '@src/screens/notification';
import Personage from '@src/screens/user/Personage';
import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator();
export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            lazy={false}
            tabBar={(props: any) => (
                <BottomTabBar {...props} safeAreaInsets={{ bottom: Theme.HOME_INDICATOR_HEIGHT }} />
            )}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: '首页',
                    tabBarStyle: {
                        backgroundColor: 'transparent',
                        borderTopColor: 'transparent',
                    },
                }}
            />
            <Tab.Screen
                name="Find"
                component={Find}
                options={{
                    tabBarLabel: '发现',
                }}
            />
            <Tab.Screen
                name="TaskCenter"
                component={Task}
                options={{
                    tabBarLabel: '赚钱',
                }}
            />
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarLabel: '通知',
                }}
            />
            <Tab.Screen
                name="Personage"
                component={Personage}
                options={{
                    tabBarLabel: '我的',
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBarIcon: { width: pixel(22), height: pixel(22) },
});
