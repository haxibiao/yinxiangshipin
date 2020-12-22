import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions } from 'react-native';
import { Iconfont } from '@src/components';
import DisplayContainer from './DisplayContainer';

export default ({ visible }) => {
    return (
        <DisplayContainer visible={visible}>
            <SpeedUpIndicator />
        </DisplayContainer>
    );
};

export const SpeedUpIndicator = function SpeedUpIndicator() {
    const opacityAnimation = useRef(new Animated.Value(0));
    const opacity1 = opacityAnimation.current.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0.4, 0.9, 0.6, 0.2],
    });
    const opacity2 = opacityAnimation.current.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0.2, 0.4, 0.9, 0.6],
    });
    const opacity3 = opacityAnimation.current.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: [0.6, 0.2, 0.4, 0.9],
    });
    // 控制器动画
    const runOpacityAnimation = useCallback(() => {
        Animated.loop(
            Animated.timing(opacityAnimation.current, {
                toValue: 3,
                duration: 600,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);

    useEffect(() => {
        runOpacityAnimation();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.indicatorWrap}>
                <View style={styles.animatedIcons}>
                    <Animated.View style={{ opacity: opacity1 }}>
                        <Iconfont name={'bofang1'} size={font(13)} color="#ffffffee" />
                    </Animated.View>
                    <Animated.View style={{ opacity: opacity2 }}>
                        <Iconfont name={'bofang1'} size={font(13)} color="#ffffffee" />
                    </Animated.View>
                    <Animated.View style={{ opacity: opacity3 }}>
                        <Iconfont name={'bofang1'} size={font(13)} color="#ffffffee" />
                    </Animated.View>
                </View>
                <Text style={styles.rate}>3.0X</Text>
                <Text style={styles.content}>快进中</Text>
            </View>
        </View>
    );
};

const TOP = Dimensions.get('window').width * 0.2;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: TOP,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    indicatorWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000066',
        height: pixel(36),
        paddingHorizontal: pixel(15),
        borderRadius: pixel(18),
    },
    animatedIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rate: {
        marginHorizontal: pixel(5),
        fontWeight: 'bold',
        fontSize: font(13),
        color: Theme.primaryColor,
    },

    content: {
        fontSize: font(13),
        color: '#ffffffEE',
    },
});
