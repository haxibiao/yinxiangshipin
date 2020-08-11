import React from 'react';
import {
    View,
    Text,
    Image,
    Animated,
    StyleSheet,
    Keyboard,
    Platform,
    LayoutChangeEvent,
    ScaledSize,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { CommonActions, useTheme } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { BoxShadow } from 'react-native-shadow';
import { observer, userStore, appStore } from '@src/store';
import { Badge } from '@src/components';
import { Overlay } from 'teaset';
import PublishMenu from './PublishMenu';

type Props = {
    state: any;
    navigation: any;
    descriptors: any;
    activeBackgroundColor?: any;
    activeTintColor?: any;
    adaptive?: any;
    allowFontScaling?: any;
    inactiveBackgroundColor?: any;
    inactiveTintColor?: any;
    keyboardHidesTabBar?: any;
    labelPosition?: any;
    labelStyle?: any;
    safeAreaInsets?: any;
    showIcon?: any;
    showLabel?: any;
    style?: any;
    tabStyle?: any;
    activeTintColor?: string;
    inactiveTintColor?: string;
};

const DEFAULT_TAB_HEIGHT = 50;

const useNativeDriver = Platform.OS !== 'web';

const iconSource = {
    Home: {
        active: require('@app/assets/images/icons/ic_home_active_white.png'),
        inactive: require('@app/assets/images/icons/ic_home_inactive.png'),
    },
    Find: {
        active: require('@app/assets/images/icons/ic_find_active.png'),
        videoActive: require('@app/assets/images/icons/ic_find_inactive_gray.png'),
        inactive: require('@app/assets/images/icons/ic_find_inactive.png'),
    },
    Notification: {
        active: require('@app/assets/images/icons/ic_message_active.png'),
        videoActive: require('@app/assets/images/icons/ic_message_inactive_gray.png'),
        inactive: require('@app/assets/images/icons/ic_message_inactive.png'),
    },
    Profile: {
        active: require('@app/assets/images/icons/ic_mine_active.png'),
        videoActive: require('@app/assets/images/icons/ic_mine_inactive_gray.png'),
        inactive: require('@app/assets/images/icons/ic_mine_inactive.png'),
    },
};

export default observer(
    ({
        state,
        navigation,
        descriptors,
        activeBackgroundColor,
        activeTintColor,
        adaptive = true,
        allowFontScaling,
        inactiveBackgroundColor,
        inactiveTintColor,
        keyboardHidesTabBar = false,
        labelPosition,
        labelStyle,
        safeAreaInsets,
        showIcon,
        showLabel,
        style,
        tabStyle,
    }: Props) => {
        const { colors } = useTheme();
        const defaultInsets = useSafeArea();

        const focusedRoute = state.routes[state.index];
        const focusedDescriptor = descriptors[focusedRoute.key];
        const focusedOptions = focusedDescriptor.options;

        const [isKeyboardShown, setIsKeyboardShown] = React.useState(false);

        const shouldShowTabBar = focusedOptions.tabBarVisible !== false && !(keyboardHidesTabBar && isKeyboardShown);

        const [isTabBarHidden, setIsTabBarHidden] = React.useState(!shouldShowTabBar);

        const [visible] = React.useState(() => new Animated.Value(shouldShowTabBar ? 1 : 0));

        React.useEffect(() => {
            if (shouldShowTabBar) {
                Animated.timing(visible, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver,
                }).start(({ finished }) => {
                    if (finished) {
                        setIsTabBarHidden(false);
                    }
                });
            } else {
                setIsTabBarHidden(true);

                Animated.timing(visible, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver,
                }).start();
            }
        }, [shouldShowTabBar, visible]);

        const [dimensions, setDimensions] = React.useState(() => {
            const { height = 0, width = 0 } = Dimensions.get('window');

            return { height, width };
        });

        React.useEffect(() => {
            const handleOrientationChange = ({ window }: { window: ScaledSize }) => {
                setDimensions(window);
            };

            Dimensions.addEventListener('change', handleOrientationChange);

            const handleKeyboardShow = () => setIsKeyboardShown(true);
            const handleKeyboardHide = () => setIsKeyboardShown(false);

            if (Platform.OS === 'ios') {
                Keyboard.addListener('keyboardWillShow', handleKeyboardShow);
                Keyboard.addListener('keyboardWillHide', handleKeyboardHide);
            } else {
                Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
                Keyboard.addListener('keyboardDidHide', handleKeyboardHide);
            }

            return () => {
                Dimensions.removeEventListener('change', handleOrientationChange);

                if (Platform.OS === 'ios') {
                    Keyboard.removeListener('keyboardWillShow', handleKeyboardShow);
                    Keyboard.removeListener('keyboardWillHide', handleKeyboardHide);
                } else {
                    Keyboard.removeListener('keyboardDidShow', handleKeyboardShow);
                    Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
                }
            };
        }, []);

        const [layout, setLayout] = React.useState({
            height: 0,
            width: dimensions.width,
        });

        const handleLayout = (e: LayoutChangeEvent) => {
            const { height, width } = e.nativeEvent.layout;

            setLayout((layout) => {
                if (height === layout.height && width === layout.width) {
                    return layout;
                } else {
                    return {
                        height,
                        width,
                    };
                }
            });
        };

        const { routes } = state;
        // routes.splice(1,0,{ key:'crate',name:'发布' });

        const insets = {
            top: safeAreaInsets?.top ?? defaultInsets.top,
            right: safeAreaInsets?.right ?? defaultInsets.right,
            bottom: safeAreaInsets?.bottom ?? defaultInsets.bottom,
            left: safeAreaInsets?.left ?? defaultInsets.left,
        };

        const tabBarItems = React.useMemo(() => {
            return routes.map((route: any, index: number) => {
                {
                    /* if (!appStore.enableWallet && route.name === 'Task') {
                    return;
                    }*/
                }

                const focused = index === state.index;
                const { options } = descriptors[route.key];
                const color = focused ? activeTintColor : inactiveTintColor;
                const tabBarLabel = descriptors[route.key].options.tabBarLabel || route.name;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!focused && !event.defaultPrevented) {
                        navigation.dispatch({
                            ...CommonActions.navigate(route.name),
                            target: state.key,
                        });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        style={styles.tabItem}
                        activeOpacity={0.9}
                        key={route.key}
                        onPress={onPress}
                        onLongPress={onLongPress}>
                        <TabBarIcon
                            name={route.name}
                            translucent={state.index === 0}
                            focused={focused}
                            activeTintColor={activeTintColor}
                            inactiveTintColor={inactiveTintColor}
                        />
                        <Text style={[styles.label, { color: state.index === 0 ? '#fff' : '#2b2b2b' }]}>
                            {tabBarLabel}
                        </Text>
                        {tabBarLabel === '通知' && appStore.unreadMessages > 0 && <View style={styles.pstBadge} />}
                    </TouchableOpacity>
                );
            });
        });

        tabBarItems.splice(2, 0, <PublishButton key="publishButton" navigation={navigation} />);

        return (
            <Animated.View
                style={[
                    styles.bottomTabBar,
                    {
                        backgroundColor: colors.card,
                        borderTopColor: colors.border,
                    },
                    {
                        transform: [
                            {
                                translateY: visible.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [layout.height + insets.bottom, 0],
                                }),
                            },
                        ],
                    },
                    {
                        height: DEFAULT_TAB_HEIGHT + insets.bottom,
                        paddingBottom: insets.bottom,
                        paddingHorizontal: Math.max(insets.left, insets.right),
                    },
                    focusedOptions.tabBarStyle,
                    appStore.modalIsShow && styles.hidden,
                ]}
                pointerEvents={isTabBarHidden ? 'none' : 'auto'}>
                <View style={styles.content} onLayout={handleLayout}>
                    {tabBarItems}
                </View>
            </Animated.View>
        );
    },
);

function TabBarIcon({ name, focused, translucent, activeTintColor, inactiveTintColor }) {
    // We render the icon twice at the same position on top of each other:
    // active and inactive one, so we can fade between them.
    return (
        <View style={styles.tabBarIcon}>
            <View style={[styles.icon, { opacity: focused ? 1 : 0 }]}>
                <Image source={iconSource[name].active} style={styles.iconSize} />
            </View>
            <View style={[styles.icon, { opacity: focused ? 0 : 1 }]}>
                <Image
                    source={translucent ? iconSource[name].videoActive : iconSource[name].inactive}
                    style={styles.iconSize}
                />
            </View>
        </View>
    );
}

function PublishButton({ navigation }) {
    // const menuKey = React.useRef();
    // const MenuView = React.useMemo(() => {
    //     const hidePublish = () => {
    //         Overlay.hide(menuKey.current);
    //     };
    //     return (
    //         <TouchableOpacity style={{ flex: 1 }} onPress={hidePublish}>
    //             <PublishMenu navigation={navigation} onMenuPress={hidePublish} enableAd={appStore.enableAd} />
    //         </TouchableOpacity>
    //     );
    // }, [appStore.enableAd]);

    const onPublishPress = React.useCallback(() => {
        if (userStore.login) {
            navigation.navigate('CreatePost');
        } else {
            navigation.navigate('Login');
        }
        // menuKey.current = Overlay.show(<Overlay.View>{MenuView}</Overlay.View>);
    }, []);

    return (
        <TouchableWithoutFeedback key="publish" onPress={onPublishPress}>
            <View style={styles.tabItem}>
                <Image
                    source={require('@app/assets/images/icons/icon_publish_red.png')}
                    style={{
                        width: pixel(43),
                        height: pixel(36),
                    }}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    bottomTabBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopWidth: StyleSheet.hairlineWidth,
        elevation: 8,
    },
    hidden: {
        zIndex: -2,
        opacity: 0,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    tabItem: {
        flex: 1,
        position: 'relative',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBarIcon: {
        position: 'relative',
        width: pixel(24),
        height: pixel(24),
    },
    icon: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        minWidth: pixel(26),
    },
    iconSize: {
        width: pixel(30),
        height: pixel(30),
    },
    label: {
        fontSize: font(10),
        marginTop: pixel(2),
    },
    pstBadge: {
        position: 'absolute',
        top: pixel(5),
        right: pixel(20),
        width: pixel(4),
        height: pixel(4),
        borderRadius: pixel(2),
        backgroundColor: '#FE1966',
    },
});
