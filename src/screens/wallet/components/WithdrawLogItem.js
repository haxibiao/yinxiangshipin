/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';

import { Row, SafeText } from 'components';

function WithdrawLogItem(props) {
    const { style, navigation, item } = props;
    console.log('item', item);
    let statusText,
        statusTextColor,
        imageUrl,
        amountColor,
        platform,
        size = pixel(46);
    switch (item.status) {
        case -1:
            statusText = '提现失败';
            statusTextColor = '#FF4C4C';
            amountColor = '#FF4C4C';
            break;
        case 1:
            statusText = '提现成功';
            statusTextColor = '#2b2b2b';
            amountColor = '#47D850';
            break;
        case 0:
            statusText = '待处理';
            statusTextColor = '#2b2b2b';
            amountColor = '#b2b2b2';
            break;
    }

    switch (String(item.to_platform).toLowerCase()) {
        case 'alipay':
            item.platform = '支付宝';
            imageUrl = require('@app/assets/images/alipay.png');
            break;
        case 'wechat':
            item.platform = '微信';
            imageUrl = require('@app/assets/images/wechat.png');
            size = pixel(44);
            break;
        default:
            item.platform = '支付宝';
            imageUrl = require('@app/assets/images/alipay.png');
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
            <View style={styles.imageWrap}>
                <Image source={imageUrl} style={{ width: size, height: size }} />
            </View>
            <View style={styles.content}>
                <View>
                    <SafeText style={[styles.statusText, { color: statusTextColor }]}>{statusText}</SafeText>
                    {item.status == -1 && (
                        <SafeText
                            style={{ fontSize: font(12), color: Theme.themeRed }}
                            numberOfLines={1}>{`${item.remark}`}</SafeText>
                    )}
                    <SafeText style={styles.time}>{item.created_at}</SafeText>
                </View>
                <View>
                    <SafeText style={{ fontSize: font(20), color: amountColor }}>￥{item.amount}</SafeText>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        marginLeft: pixel(12),
        marginRight: pixel(18),
        paddingVertical: pixel(12),
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: pixel(12),
    },
    imageWrap: {
        height: pixel(50),
        width: pixel(50),
        justifyContent: 'center',
        alignItems: 'center',
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
