import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { observer, userStore, appStore } from '@src/store';
import * as PermissionChecker from '../screens/live/CommonWidgetPermissionChecker';

const items = [
    {
        name: '发动态',
        route: 'CreatePost',
        url: require('@app/assets/images/postNews.png'),
    },
    {
        name: '写问题',
        route: 'WriteIssue',
        url: require('@app/assets/images/postAQuestion.png'),
    },
    // {
    //     name: '开直播',
    //     route: 'StartLive',
    //     url: require('@app/assets/images/liveBroadcast.png'),
    // },
];

const PublishMenu = observer(({ navigation, onMenuPress, enableAd }) => {
    if (enableAd && items.length < 3) {
        items.push({
            name: '开直播',
            route: 'StartLive',
            url: require('@app/assets/images/liveBroadcast.png'),
        });
    }

    const onPublishPress = useCallback(route => {
        // 开直播点击事件处理
        if (route === 'StartLive') {
            if (userStore.login) {
                if (appStore.sufficient_permissions) {
                    navigation.navigate('startlive');
                    onMenuPress();
                } else {
                    // 权限不够，打开权限窗口
                    PermissionChecker.showPermissionCheck();
                    // Toast.show({ content: '权限不够！' });
                }
            } else {
                navigation.navigate('Login');
            }
            return;
        }

        navigation.navigate(route);
        onMenuPress();
    }, []);

    const menuAnimations = useRef(items.map(() => new Animated.Value(0)));
    const closeAnimation = useRef(new Animated.Value(0));

    useEffect(() => {
        Animated.parallel([
            Animated.stagger(
                100,
                menuAnimations.current.map(anim =>
                    Animated.spring(anim, {
                        toValue: 1,
                        friction: 4,
                        tension: 10,
                        useNativeDriver: true,
                    }),
                ),
            ),
            Animated.timing(closeAnimation.current, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const rotateZ = closeAnimation.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['-90deg', '0deg'],
    });

    const menuItems = useMemo(() => {
        return items.map((item, i) => {
            return (
                <TouchableWithoutFeedback key={item.name} onPress={() => onPublishPress(item.route)}>
                    <Animated.View
                        style={[
                            styles.menuItem,
                            {
                                transform: [
                                    {
                                        translateY: menuAnimations.current[i].interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [200, 0],
                                        }),
                                    },
                                ],
                            },
                        ]}>
                        <Image source={item.url} style={styles.menuImage} />
                        <Text style={styles.menuName}>{item.name}</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            );
        });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.menuBar}>{menuItems}</View>
            <View style={styles.closeBtn}>
                <Animated.Image
                    style={[
                        styles.closeBtnImage,
                        {
                            transform: [
                                {
                                    rotate: rotateZ,
                                },
                            ],
                        },
                    ]}
                    source={require('@app/assets/images/sending_close.png')}
                />
            </View>
        </View>
    );
});

export default PublishMenu;

// @app/assets/images/liveBroadcast.png'
// @app/assets/images/postNews.png'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'flex-end',
        paddingBottom: Theme.bottomInset,
    },
    menuBar: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: pixel(35),
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: pixel(20),
    },
    menuImage: {
        width: pixel(50),
        height: pixel(50),
        borderRadius: pixel(25),
    },
    menuName: {
        color: '#000000',
        fontSize: font(13),
        marginTop: pixel(5),
    },
    closeBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: pixel(20),
    },
    closeBtnImage: {
        width: pixel(20),
        height: pixel(20),
    },
});
