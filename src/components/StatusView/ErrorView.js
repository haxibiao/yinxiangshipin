/*
 * @flow
 * created by wyk made in 2018-12-06 16:01:41
 */
'use strict';

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

type Props = {
    title?: string,
    imageSource?: any,
    style?: any,
    titleStyle?: any,
};

class ErrorView extends React.Component<Props> {
    static defaultProps = {
        title: '页面出错啦',
        imageSource: require('@app/assets/images/default_error.png'),
    };

    render() {
        const { title, imageSource, style, titleStyle } = this.props;

        return (
            <View style={[styles.container, style]}>
                <Image style={styles.image} source={imageSource} />
                <Text style={[styles.title, titleStyle]}>{title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: percent(80),
    },
    image: {
        width: percent(36),
        height: percent(36),
        resizeMode: 'cover',
    },
    title: {
        fontSize: font(12),
        marginTop: pixel(10),
        color: Theme.subTextColor,
    },
    button: {
        maxWidth: '60%',
        height: pixel(44),
        borderRadius: pixel(6),
        marginTop: pixel(40),
        borderWidth: 0,
    },
    buttonText: {
        fontSize: font(14),
        color: '#fff',
    },
});

export default ErrorView;
