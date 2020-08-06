/*
 * @flow
 * created by wyk made in 2019-01-09 10:11:47
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Avatar, SafeText, FollowButton } from '@src/components';

import { userStore } from '@src/store';
import { GQL, useMutation } from '@src/apollo';

// type User = {
//     id: number;
//     avatar: any;
//     name: string;
//     followed_status: number;
//     introduction?: string;
// };

interface Props {
    user: any;
    style?: any;
    navigation?: any;
}

const UserBlockItem = (props: Props) => {
    const { user, style } = props;
    const { me } = userStore;
    const { id = 1, avatar, name, followed_status, introduction } = user;
    const navigation = useNavigation();

    const [removeUserBlock, { error, data: callBackData }] = useMutation(GQL.removeUserBlockMutation, {
        variables: {
            id: user.id,
        },
        errorPolicy: 'all',
        refetchQueries: () => [
            {
                query: GQL.showUserBlockQuery,
                variables: { user_id: me.id },
            },
        ],
    });

    if (error || callBackData) {
        // console.log('quxiao拉黑结果', callBackData);
        Toast.show({
            content: error
                ? '服务器响应失败！'
                : callBackData.removeUserBlock === 1
                ? '移除黑名单成功！'
                : '移除黑名单失败！',
        });
    }

    return (
        <View style={[styles.item, style]}>
            <Avatar source={avatar} size={pixel(50)} />
            <View style={styles.right}>
                <View style={styles.info}>
                    <SafeText style={styles.nameText}>{name}</SafeText>
                    {!!introduction && (
                        <View style={{ flex: 1 }}>
                            <SafeText style={styles.introduction} numberOfLines={1}>
                                {introduction}
                            </SafeText>
                        </View>
                    )}
                </View>
                <TouchableOpacity style={styles.buttonsStyle} onPress={() => removeUserBlock()}>
                    <Text style={styles.titleStyle} numberOfLines={1}>
                        取消拉黑
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonsStyle: {
        alignItems: 'center',
        backgroundColor: Theme.subTextColor,
        borderRadius: pixel(15),
        flexDirection: 'row',
        height: pixel(30),
        justifyContent: 'center',
        width: pixel(70),
    },
    info: {
        flex: 1,
        marginRight: pixel(Theme.itemSpace),
    },
    introduction: {
        color: '#696482',
        fontSize: font(12),
        marginTop: pixel(8),
    },
    item: {
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: pixel(Theme.itemSpace),
    },
    labelText: { color: '#fff', fontSize: font(12), lineHeight: font(14), marginLeft: pixel(2) },
    nameText: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        marginRight: pixel(2),
    },
    right: {
        alignItems: 'center',
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(1),
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingVertical: pixel(20),
    },
    titleStyle: {
        color: '#FFF',
        fontSize: font(13),
        overflow: 'hidden',
    },
});

export default UserBlockItem;
