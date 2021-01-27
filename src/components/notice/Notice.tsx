import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    Animated,
    Easing,
    Pressable,
    StatusBar,
    NativeModules,
} from 'react-native';
import { BoxShadow } from 'react-native-shadow';

const { StatusBarManager } = NativeModules;
let statusBarHeight = 15;
if (Platform.OS == 'android') {
    statusBarHeight += StatusBar.currentHeight || 20;
} else {
    StatusBarManager.getHeight(({ height }) => {
        statusBarHeight += height;
    });
}

const MESSAGE_WIDTH = Device.width - pixel(40);
const MESSAGE_HEIGHT = MESSAGE_WIDTH * 0.22;
const PADDING_H = pixel(16);
const PADDING_V = pixel(12);
const CONTENT_HEIGHT = MESSAGE_HEIGHT - PADDING_V * 2;

const H_FADE_VALUE = MESSAGE_WIDTH * 1.5;
const V_FADE_VALUE = MESSAGE_HEIGHT * 1.5;

export interface NoticeProps {
    key: number;
    url?: string;
    title: string;
    content?: string;
    handler?: (p?: any) => void;
    position?: 'top' | 'left' | 'right';
}

export default function Notice({ notice, onClose }: { notice: NoticeProps; onClose: (k: any) => void }) {
    const timer = useRef();
    const animation = useRef(new Animated.Value(0));
    const animationStyle = {
        transform: [
            {
                translateX: animation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-MESSAGE_WIDTH, 0],
                }),
            },
        ],
    };

    const slideIn = useCallback(() => {
        Animated.timing(animation.current, {
            toValue: 1,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start((e) => {
            timer.current = setTimeout(() => {
                slideOut();
            }, 3000);
        });
    }, [slideOut]);

    const slideOut = useCallback(() => {
        Animated.timing(animation.current, {
            toValue: 0,
            duration: 600,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start((e) => {
            onClose(notice.key);
        });
    }, [notice]);

    useEffect(() => {
        slideIn();
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    return (
        <Animated.View style={[{ position: 'absolute', marginTop: statusBarHeight }, animationStyle]}>
            <BoxShadow setting={messageWrap}>
                <Pressable
                    style={styles.messageBox}
                    onPress={() => {
                        if (notice.handler instanceof Function) {
                            notice.handler();
                            clearTimeout(timer.current);
                            slideOut();
                        }
                    }}>
                    <View style={styles.messageBody}>
                        <Image
                            style={styles.avatar}
                            source={notice.url || require('@app/assets/images/app_logo.png')}
                        />
                        <View style={styles.info}>
                            <Text style={styles.title} numberOfLines={1}>
                                {notice?.title || Config.AppName}
                            </Text>
                            <Text style={styles.content} numberOfLines={2}>
                                {notice?.content}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>查 看</Text>
                    </View>
                </Pressable>
            </BoxShadow>
        </Animated.View>
    );
}

const messageWrap = {
    width: MESSAGE_WIDTH,
    height: MESSAGE_HEIGHT,
    color: '#FFEBEE',
    border: pixel(5),
    radius: pixel(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {},
};

const styles = StyleSheet.create({
    // messageBox: {
    //     position: 'absolute',
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     width: MESSAGE_WIDTH,
    //     height: MESSAGE_HEIGHT,
    //     paddingHorizontal: PADDING_H,
    //     paddingVertical: PADDING_V,
    //     borderRadius: pixel(12),
    //     backgroundColor: '#ffffff',
    //     ...Platform.select({
    //         ios: {
    //             shadowColor: '#909090',
    //             shadowOpacity: 0.24,
    //             shadowRadius: pixel(8),
    //             shadowOffset: {
    //                 width: 0,
    //                 height: pixel(3),
    //             },
    //         },
    //         android: {
    //             elevation: 6,
    //         },
    //     }),
    // },
    messageBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PADDING_H,
        paddingVertical: PADDING_V,
        borderRadius: pixel(10),
        backgroundColor: '#ffffff',
    },
    messageBody: {
        flex: 1,
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginLeft: pixel(14),
    },
    avatar: {
        width: CONTENT_HEIGHT,
        height: CONTENT_HEIGHT,
        borderRadius: CONTENT_HEIGHT / 2,
        backgroundColor: '#f0f0f0',
    },
    title: {
        color: '#202020',
        fontSize: font(15),
        lineHeight: font(20),
        fontWeight: 'bold',
    },
    content: {
        marginTop: pixel(2),
        color: '#909090',
        fontSize: font(13),
        lineHeight: font(20),
    },
    button: {
        marginLeft: pixel(20),
        width: CONTENT_HEIGHT * 1.3,
        height: CONTENT_HEIGHT * 0.6,
        borderRadius: CONTENT_HEIGHT * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FB4883',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: font(15),
        lineHeight: font(20),
    },
});
