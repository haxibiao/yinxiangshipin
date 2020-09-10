/*
 * @flow
 * created by wyk made in 2018-12-14 16:06:39
 */

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import TouchFeedback from '../Basic/TouchFeedback';

type Props = {
    style?: style,
    disabled: ?boolean,
    onPress?: Function,
    leftComponent?: any,
    rightComponent?: any,
};

class ListItem extends Component<Props> {
    static defaultProps = {
        onPress: () => null,
    };

    render() {
        let { style, disabled, onPress, leftComponent, rightComponent } = this.props;
        style = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...style,
        };
        return (
            <TouchFeedback onPress={onPress} disabled={disabled} activeOpacity={1}>
                <View style={style}>
                    <View>{leftComponent}</View>
                    <View>{rightComponent}</View>
                </View>
            </TouchFeedback>
        );
    }
}

const styles = StyleSheet.create({});

export default ListItem;
