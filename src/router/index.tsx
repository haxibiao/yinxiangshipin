import React from 'react';
import {
    NavigationContainer,
    CommonActions,
    useNavigation,
    useRoute,
    NavigationContext,
} from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { name } from '@app/app.json';
import BottomTabNavigator from './BottomTabNavigator';
import SCREENS from './routes';
import privateRoutes from './privateRoutes';

const router: { [key: string]: any } = privateRoutes;

export { useNavigation, useRoute, CommonActions };

export let rootNavigation: any = null;

export function setRootNavigation(ref: any) {
    rootNavigation = ref;
}

export const authNavigate = (routeName: string, params?: object, auth: boolean) => {
    const authAction = CommonActions.navigate('Login');

    const navigateAction = CommonActions.navigate(routeName, params);

    if (auth && router[routeName] && !TOKEN) {
        rootNavigation.dispatch(authAction);
    } else {
        rootNavigation.dispatch(navigateAction);
    }
};

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
        <NavigationContainer ref={setRootNavigation} linking={{ prefixes: [`${name}://`] }}>
            <Stack.Navigator initialRouteName="Main" headerMode="none">
                <Stack.Screen name="Main" component={BottomTabNavigator} />
                {(Object.keys(SCREENS) as (keyof typeof SCREENS)[]).map(routeName => (
                    <Stack.Screen
                        key={routeName}
                        name={routeName}
                        component={SCREENS[routeName].component}
                        initialParams={SCREENS[routeName].params}
                        options={{
                            cardStyleInterpolator: ['Login', 'ToLogin'].includes(routeName)
                                ? CardStyleInterpolators.forVerticalIOS
                                : CardStyleInterpolators.forHorizontalIOS,
                        }}
                    />
                ))}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
