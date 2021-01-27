/*
 * @flow
 * created by wyk made in 2019-01-09 10:11:47
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';

import Iconfont from '../Iconfont';
import Row from '../Basic/Row';
import Avatar from '../Basic/Avatar';
import SafeText from '../Basic/SafeText';
import FollowButton from './FollowButton';

type User = {
    id: number,
    avatar: any,
    name: string,
    followed_status: number,
    introduction?: string,
};

type Props = {
    style: ViewStyle,
    user: User,
    navigation: any,
};

class UserItem extends Component<Props> {
    render() {
        const { user, style, navigation } = this.props;

        return (
            <TouchableOpacity style={[styles.item, style]} onPress={() => navigation.navigate('User', { user })}>
                <Avatar source={user?.avatar} size={pixel(50)} />
                <View style={styles.right}>
                    <View style={styles.info}>
                        <SafeText style={styles.nameText} numberOfLines={1}>
                            {user?.name}
                        </SafeText>
                        {!!user?.introduction && (
                            <View style={{ flex: 1 }}>
                                <SafeText style={styles.introduction} numberOfLines={1}>
                                    {user?.introduction}
                                </SafeText>
                            </View>
                        )}
                    </View>
                    <FollowButton
                        user={user}
                        style={{
                            width: pixel(70),
                            height: pixel(30),
                            borderRadius: pixel(15),
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    info: {
        flex: 1,
        marginRight: pixel(Theme.edgeDistance),
    },
    introduction: {
        marginTop: pixel(8),
        fontSize: font(12),
        color: '#696482',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: pixel(Theme.edgeDistance),
    },
    labelText: { fontSize: font(12), color: '#fff', marginLeft: pixel(2), lineHeight: font(14) },
    nameText: {
        fontSize: font(16),
        color: Theme.defaultTextColor,
        marginRight: pixel(2),
    },
    right: {
        flex: 1,
        paddingHorizontal: pixel(Theme.edgeDistance),
        paddingVertical: pixel(20),
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: pixel(1),
        borderBottomColor: Theme.borderColor,
    },
});

export default UserItem;
