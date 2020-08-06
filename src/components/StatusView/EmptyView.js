/*
 * @flow
 * created by wyk made in 2018-12-14 10:44:05
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
class EmptyView extends React.Component<Props> {
    static defaultProps = {
        title: '此处空空如也~',
        imageSource: require('@app/assets/images/default_blank.png'),
    };

    render() {
        const { title, imageSource, style, titleStyle, guideFn } = this.props;

        return (
            <View style={[styles.container, style]}>
                <Image style={styles.image} source={imageSource} />
                <Text style={[styles.title, guideFn && { color: Theme.primaryColor }, titleStyle]} onPress={guideFn}>
                    {title}
                </Text>
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
        resizeMode: 'contain',
    },
    title: {
        fontSize: font(14),
        color: Theme.subTextColor,
        marginTop: pixel(10),
    },
});

export default EmptyView;
