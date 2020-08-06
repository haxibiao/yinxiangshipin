/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

import { Row } from 'components';

function WithdrawLogItem(props) {
    const { style, navigation, item } = props;
    console.log('item', item);
    let statusText,
        color,
        imageUrl,
        size = 40;
    switch (item.status) {
        case -1:
            statusText = '提现失败';
            color = Theme.errorColor;
            break;
        case 1:
            statusText = '提现成功';
            color = Theme.weixin;
            break;
        case 0:
            statusText = '待处理';
            color = Theme.correctColor;
            break;
    }

    switch (item.to_platform) {
        case 'Alipay':
            imageUrl = require('@app/assets/images/alipay.png');
            break;
        case 'Wechat':
            imageUrl = require('@app/assets/images/wechat.png');
            break;
        case 'dongdezhuan':
            imageUrl = require('@app/assets/images/dongdezhuan.png');
            break;
        default:
            imageUrl = require('@app/assets/images/alipay.png');
            size = 46;
            break;
    }

    return (
        <TouchableOpacity
            style={[styles.item, style]}
            activeOpacity={0.7}
            disabled={item.status == 0}
            onPress={() =>
                navigation.navigate('WithdrawDetail', {
                    item: item,
                })
            }>
            <Image source={imageUrl} style={{ width: size, height: size, marginVertical: pixel(15) }} />
            <Row style={styles.content}>
                <View style={{ width: (Device.WIDTH * 4) / 7 }}>
                    <Text style={styles.statusText}>
                        {item.to_platform === 'dongdezhuan' ? '提现到懂得赚' : statusText}
                    </Text>
                    {item.status == -1 && (
                        <Text
                            style={{ fontSize: font(12), color: Theme.themeRed }}
                            numberOfLines={1}>{`${item.remark}`}</Text>
                    )}
                    <Text style={styles.time}>{item.created_at}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: font(20), color }}>￥{item.amount}</Text>
                </View>
            </Row>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    content: {
        alignItems: 'flex-start',
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 0.5,
        paddingVertical: 15,
    },
    image: {
        height: 40,
        marginVertical: pixel(15),
        width: 40,
    },
    item: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    statusText: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        lineHeight: font(22),
    },
    time: {
        color: Theme.subTextColor,
        fontSize: font(12),
        lineHeight: font(22),
    },
});

export default WithdrawLogItem;
