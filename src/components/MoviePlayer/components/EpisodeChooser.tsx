import React, { useRef, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, Easing, Dimensions, InteractionManager, LogBox } from 'react-native';
import { TapGestureHandler, State, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { observer } from 'mobx-react';
import playerStore from '../Store';

const CHOOSER_WIDTH = Dimensions.get('window').height * 0.46;
const PADDING = pixel(20);
const ITEM_SPACE = pixel(10);
const ITEM_WIDTH = (CHOOSER_WIDTH - PADDING * 2 - ITEM_SPACE * 4) / 5;

export default observer(() => {
    const animation = useRef(new Animated.Value(0));
    const animationStyle = {
        transform: [
            {
                translateX: animation.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [CHOOSER_WIDTH, 0],
                }),
            },
        ],
    };

    const slideAnimation = useCallback((toValue: 0 | 1, callback?: () => void) => {
        Animated.timing(animation.current, {
            toValue,
            duration: 400,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            if (callback instanceof Function) {
                callback();
            }
        });
    }, []);

    const chooseValue = useCallback((value: number) => {
        playerStore.setCurrentEpisode(value);
        InteractionManager.runAfterInteractions(() => {
            slideAnimation(0, () => {
                playerStore.toggleSeriesChooserVisible(false);
            });
        });
    }, []);

    const slideOut = useCallback(({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
            InteractionManager.runAfterInteractions(() => {
                slideAnimation(0, () => {
                    playerStore.toggleSeriesChooserVisible(false);
                });
            });
        }
    }, []);

    useEffect(() => {
        if (playerStore.seriesChooserVisible) {
            slideAnimation(1);
        }
    }, [playerStore.seriesChooserVisible]);

    if (!playerStore.seriesChooserVisible) {
        return null;
    }

    return (
        <TapGestureHandler onHandlerStateChange={slideOut}>
            <View style={styles.container}>
                <Animated.View style={[styles.chooserBox, animationStyle]}>
                    <LinearGradient
                        style={styles.chooserWrap}
                        start={{ x: 1, y: 0.5 }}
                        end={{ x: 0, y: 0.5 }}
                        colors={['#00000099', '#00000077', '#00000055', '#00000000']}>
                        <View style={styles.head}>
                            <Text style={styles.title}>选集({playerStore.series.length})</Text>
                        </View>
                        <ScrollView contentContainerStyle={styles.episodeList}>
                            <View style={styles.episodeWrap}>
                                {playerStore.series.map((value, index) => {
                                    const current = value?.url === playerStore.currentEpisode?.url;
                                    return (
                                        <TapGestureHandler
                                            key={index}
                                            onHandlerStateChange={({ nativeEvent }) => {
                                                if (nativeEvent.state === State.ACTIVE) {
                                                    chooseValue(value);
                                                }
                                            }}>
                                            <View style={styles.episodeItem}>
                                                <Text
                                                    style={[styles.itemText, current && { color: Theme.primaryColor }]}>
                                                    {index + 1}
                                                </Text>
                                            </View>
                                        </TapGestureHandler>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </LinearGradient>
                </Animated.View>
            </View>
        </TapGestureHandler>
    );
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backgroundColor: '#00000044',
    },
    chooserBox: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: CHOOSER_WIDTH,
    },
    chooserWrap: {
        ...StyleSheet.absoluteFill,
        paddingHorizontal: PADDING,
        paddingTop: PADDING,
    },
    head: {
        marginBottom: ITEM_SPACE,
    },
    title: {
        fontSize: font(15),
        color: '#ffffff',
    },
    episodeList: {
        marginRight: -ITEM_SPACE,
    },
    episodeWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    episodeItem: {
        marginRight: ITEM_SPACE,
        marginBottom: ITEM_SPACE,
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: pixel(5),
        backgroundColor: '#ffffff44',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: font(17),
        color: '#ffffff',
    },
});
