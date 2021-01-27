/*
 * @flow
 * created by wyk made in 2019-01-06 21:58:37
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

type Props = {
    hidden: boolean,
    finished: boolean,
    text: string,
};
class Footer extends Component<Props> {
    render() {
        let { hidden, finished, text } = this.props;
        if (hidden) {
            return null;
        }
        if (finished) {
            return (
                <View style={styles.footerView}>
                    <Text style={styles.footerViewText}>{text || '没有更多了哦'}</Text>
                </View>
            );
        } else {
            return (
                <View style={styles.footerView}>
                    <Text style={styles.footerViewText}>加载中</Text>
                    <ActivityIndicator size={'small'} color={Theme.secondaryColor} />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    footerView: {
        paddingVertical: pixel(Theme.edgeDistance),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerViewText: {
        fontSize: font(13),
        color: Theme.subTextColor,
        marginHorizontal: pixel(10),
    },
});

export default Footer;
