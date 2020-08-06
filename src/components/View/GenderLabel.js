/*
 * @flow
 * created by wyk made in 2018-12-20 11:47:22
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import Iconfont from '../Iconfont';

class GenderLabel extends Component {
    static defaultProps = {
        fontSize: font(12),
    };

    render() {
        const { user, imageStyle, fontSize } = this.props;
        const source =
            user.gender === '男'
                ? require('@app/assets/images/icon_boy.png')
                : require('@app/assets/images/icon_girl.png');
        return (
            <ImageBackground source={source} style={[styles.image, imageStyle]}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize, color: '#fff', textAlign: 'center' }}>{user.age || '18'}</Text>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    image: { width: pixel(36), height: pixel(18), flexDirection: 'row' },
});

export default GenderLabel;
