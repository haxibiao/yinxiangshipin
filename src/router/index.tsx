import React from 'react';
import { NavigationContainer, useNavigation, useRoute, NavigationContext } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators, TransitionSpecs } from '@react-navigation/stack';
import { name } from '@app/app.json';
import { appStore } from '@src/store';
import { navigationRef, isReadyRef } from '@src/common';
import SCREENS from './routes';
import BottomTabNavigator from './BottomTabNavigator';

export { useNavigation, useRoute };

export function withNavigation(WrappedComponent: React.Component): React.Component {
    return class HP extends React.Component {
        static contextType = NavigationContext;

        render() {
            return <WrappedComponent {...this.props} navigation={this.context} />;
        }
    };
}

type StackParamList = {
    Main: undefined;
} & {
    [P in keyof typeof SCREENS]: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export default () => {
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                isReadyRef.current = true;
            }}
            linking={{ prefixes: [`${name}://`] }}
            onStateChange={() => {
                const currentRouteName = navigationRef.current.getCurrentRoute().name;
                appStore.currentRouteName = currentRouteName;
            }}>
            <Stack.Navigator initialRouteName="Main" headerMode="none">
                <Stack.Screen name="Main" component={BottomTabNavigator} />
                {(Object.keys(SCREENS) as (keyof typeof SCREENS)[]).map((routeName) => (
                    <Stack.Screen
                        key={routeName}
                        name={routeName}
                        component={SCREENS[routeName].component}
                        initialParams={SCREENS[routeName].params}
                        options={{
                            cardStyleInterpolator: ['Login', 'ToLogin'].includes(routeName)
                                ? CardStyleInterpolators.forVerticalIOS
                                : CardStyleInterpolators.forHorizontalIOS,
                            ...TransitionScreen,
                        }}
                    />
                ))}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const TransitionScreen = {
    gestureDirection: 'horizontal',
    transitionSpec: {
        open: TransitionSpecs.TransitionIOSSpec,
        close: TransitionSpecs.TransitionIOSSpec,
    },
    cardStyleInterpolator: ({ current, next, layouts }) => {
        return {
            cardStyle: {
                transform: [
                    {
                        translateX: current.progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [layouts.screen.width, 0],
                        }),
                    },
                    {
                        translateX: next
                            ? next.progress.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0, -layouts.screen.width],
                              })
                            : 0,
                    },
                ],
            },
            overlayStyle: {
                opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                }),
            },
        };
    },
};
