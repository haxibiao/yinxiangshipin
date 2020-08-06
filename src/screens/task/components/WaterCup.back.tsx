import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Easing } from 'react-native';

const botHeight = 250;

interface Props {
    value: number;
}

export default (props: any) => {
    const [moveOne, setMoveOne] = useState(new Animated.Value(0));
    const [moveTwo, setMoveTwo] = useState(new Animated.Value(0));
    // const [mb, setMb] = useState(0);

    function _anim() {
        let animOneM1 = Animated.timing(moveOne, {
            toValue: -200,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
        });
        let animOneM2 = Animated.timing(moveOne, {
            toValue: 180,
            duration: 0,
            easing: Easing.linear,
            useNativeDriver: true,
        });
        let animOneMR = Animated.timing(moveOne, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
        });
        let animTwoM1 = Animated.timing(moveTwo, {
            toValue: -400,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        });
        let animTwoMR = Animated.timing(moveTwo, {
            toValue: 0,
            duration: 0,
            easing: Easing.linear,
            useNativeDriver: true,
        });
        let animOne = Animated.sequence([animOneM1, animOneM2, animOneMR], { useNativeDriver: true });
        let animTwo = Animated.sequence([animTwoM1, animTwoMR], { useNativeDriver: true });
        let anim = Animated.parallel([animOne, animTwo], { stopTogether: false, useNativeDriver: true });
        // Animated.sequence([animTwoM1,animTwoMR]).start();
        Animated.loop(anim, { useNativeDriver: true }).start();
    }

    // function _updateProgress(h) {
    //     props.setValue(h);
    // }

    useEffect(() => {
        _anim();
    }, []);

    return (
        <View style={styles.bottleWrapper}>
            <View style={styles.bottleDoubleGen} />
            <View style={styles.bottle}>
                <View style={[styles.spiriteWrapper, { marginBottom: botHeight * ((props.value - 20) / 100) }]}>
                    <Animated.View
                        style={{
                            width: 150,
                            height: 40,
                            marginBottom: 0,
                            transform: [{ translateX: moveOne }],
                        }}>
                        <Image
                            source={require('@app/assets/images/wavetwo.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={'contain'}
                        />
                    </Animated.View>
                    <Animated.View
                        style={{
                            width: 150,
                            height: 40,
                            transform: [{ translateX: moveTwo }],
                            position: 'absolute',
                            bottom: 0,
                            right: -200,
                        }}>
                        <Image
                            source={require('@app/assets/images/wavetwo.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={'contain'}
                        />
                    </Animated.View>
                </View>

                <View style={[styles.background, { paddingBottom: botHeight * ((props.value - 20) / 100) + 20 }]}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#D7F7E1',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottle: {
        width: 160,
        height: botHeight,
        borderWidth: 10,
        borderColor: '#e9e9e9',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        overflow: 'hidden',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
    },
    bottleWrapper: {
        width: 160,
        height: botHeight,
    },
    bottleDoubleGen: {
        width: 160,
        height: botHeight,
        borderWidth: 10,
        borderColor: '#e9e9e9',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        zIndex: 99999,
    },
    spiriteWrapper: {
        height: 70,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    background: {
        height: 20,
        width: '100%',
        backgroundColor: '#58CAF7',
        position: 'absolute',
        bottom: 0,
        zIndex: -999,
    },
});
