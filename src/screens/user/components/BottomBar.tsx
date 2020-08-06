/*
 * @flow
 * created by wyk made in 2019-01-07 10:51:29
 */
'use strict';

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FollowButton, TouchFeedback } from '@src/components';
import { userStore, observer } from '@src/store';
import { useNavigation, useRoute } from '@react-navigation/native';
const BottomBar = observer((props: any) => {
    const { user, style = {} } = props;
    const navigation = useNavigation();
    if (userStore.me.id === user.id) {
        return null;
    }
    return (
        <LinearGradient
            style={[styles.container, style]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}>
            <FollowButton
                id={user.id}
                followedStatus={user.followed_status}
                style={styles.button}
                titleStyle={styles.titleStyle}
            />
            <TouchFeedback
                style={[styles.button, { backgroundColor: Theme.watermelon }]}
                onPress={() => {
                    if (TOKEN) {
                        navigation.navigate('Chat', {
                            chat: {
                                withUser: { ...user },
                            },
                        });
                    } else {
                        navigation.navigate('Login');
                    }
                }}>
                <Text style={styles.titleStyle} numberOfLines={1}>
                    聊天
                </Text>
            </TouchFeedback>
        </LinearGradient>
    );
});

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        paddingTop: pixel(20),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT || pixel(20),
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: percent(36),
        height: percent(12),
        borderRadius: percent(6),
    },
    titleStyle: {
        fontSize: font(16),
        color: '#fff',
    },
});

export default BottomBar;
