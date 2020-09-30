/*
 * @flow
 * created by wyk made in 2019-04-11 18:10:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Row, SafeText } from '@src/components';

class IncomeAndExpenditureItem extends Component {
    render() {
        const { navigation, item } = this.props;
        return (
            <View style={styles.item}>
                <Row style={{ justifyContent: 'space-between' }}>
                    <SafeText style={{ fontSize: font(15), color: Theme.defaultTextColor }}>{item.remark}</SafeText>
                    <SafeText
                        style={{
                            fontSize: font(20),
                            color: item.gold > 0 ? Theme.primaryColor : Theme.secondaryColor,
                        }}>
                        {item.gold > 0 ? '+' + item.gold : item.gold}
                    </SafeText>
                </Row>
                <Row style={{ justifyContent: 'space-between', marginTop: pixel(10) }}>
                    <SafeText style={{ fontSize: font(12), color: Theme.subTextColor }}>{item.created_at}</SafeText>
                    <SafeText
                        style={{
                            fontSize: font(12),
                            color: Theme.subTextColor,
                        }}>{`剩余${Config.goldAlias}: ${item.balance}`}</SafeText>
                </Row>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        padding: pixel(Theme.itemSpace),
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(1),
    },
});

export default IncomeAndExpenditureItem;
