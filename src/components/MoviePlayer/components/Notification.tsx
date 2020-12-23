import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions, InteractionManager } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import playerStore from '../PlayerStore';

const FADE_VALUE = Dimensions.get('window').width * 0.25;

export default observer(() => {
    const [noticeData, setNoticeData] = useState();
    const shown = useRef(false);
    const animation = useRef(new Animated.Value(0));
    const animationStyle = {
        transform: [
            {
                translateY: animation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-FADE_VALUE, 0],
                }),
            },
        ],
    };

    const slideAnimation = useCallback(() => {
        Animated.sequence([
            Animated.timing(animation.current, {
                toValue: 1,
                duration: 400,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.delay(1500),
            Animated.timing(animation.current, {
                toValue: 0,
                duration: 400,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start((e) => {
            if (e.finished) {
                playerStore.reduceNotice();
                shown.current = false;
                setNoticeData();
            }
        });
    }, []);

    const slideInNotice = useCallback((data) => {
        if (!shown.current) {
            shown.current = true;
            setNoticeData(data);
            InteractionManager.runAfterInteractions(() => {
                slideAnimation();
            });
        }
    }, []);

    useEffect(
        () =>
            autorun(() => {
                if (playerStore.notice.length > 0) {
                    slideInNotice(playerStore.notice[0]);
                }
            }),
        [],
    );

    if (!noticeData) {
        return;
    }

    return (
        <Animated.View style={[styles.container, animationStyle]}>
            <LinearGradient
                style={styles.notificationWrap}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#00000044', '#00000000']}>
                <View style={styles.notificationItem}>
                    <Text style={styles.notificationText}>{noticeData?.content}</Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    notificationWrap: {
        ...StyleSheet.absoluteFill,
        paddingVertical: pixel(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationItem: {
        padding: pixel(10),
    },
    notificationText: {
        fontSize: font(15),
        color: '#ffffff',
    },
});
