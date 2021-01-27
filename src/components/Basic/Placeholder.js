/*
 * @flow
 * created by wyk made in 2019-01-09 21:39:00
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Iconfont from '../Iconfont';
import Row from './Row';

const render = {
    post: color => (
        <View style={styles.placeholder}>
            <Row>
                <View style={[styles.avatar, { backgroundColor: color }]} />
                <Row>
                    <View style={[styles.strip, { backgroundColor: color }]} />
                </Row>
            </Row>
            <View style={[styles.content, { backgroundColor: color }]} />
            <Row>
                <View style={[styles.label, { backgroundColor: color }]} />
                <Iconfont name="xihuanfill" size={pixel(20)} color={color} style={{ marginHorizontal: pixel(10) }} />
                <View style={[styles.label, { backgroundColor: color }]} />
                <Iconfont name="liuyanfill" size={pixel(20)} color={color} style={{ marginLeft: pixel(10) }} />
                <View style={{ flex: 1 }} />
                <Iconfont name="qita1" size={pixel(24)} color={color} />
            </Row>
        </View>
    ),
    comment: color => (
        <View style={[styles.placeholder, { flexDirection: 'row', alignItems: 'flex-start' }]}>
            <View style={[styles.avatar, { backgroundColor: color }]} />
            <View style={{ flex: 1 }}>
                <View style={styles.group}>
                    <View>
                        <View style={[styles.strip, { height: pixel(15), backgroundColor: color }]} />
                        <View
                            style={[
                                styles.strip,
                                { height: pixel(15), marginVertical: pixel(10), backgroundColor: color },
                            ]}
                        />
                    </View>
                    <Iconfont name="zantongfill" size={pixel(24)} color={color} />
                </View>
                <View style={[styles.paragraph, { flex: 0, backgroundColor: color }]} />
                <View style={[styles.paragraph, { flex: 0, backgroundColor: color }]} />
            </View>
        </View>
    ),
    chat: color => (
        <View style={styles.placeholder}>
            <Row style={{ flex: 1 }}>
                <View style={[styles.avatar, styles.bigAvatar, { backgroundColor: color }]} />
                <View style={{ flex: 1 }}>
                    <View style={[styles.paragraph, { flex: 0, backgroundColor: color }]} />
                    <View style={[styles.paragraph, { flex: 0, backgroundColor: color }]} />
                </View>
            </Row>
        </View>
    ),
    list: color => (
        <View style={styles.placeholder}>
            <Row>
                <View style={[styles.avatar, styles.cover, { backgroundColor: color }]} />
                <View style={{ flex: 1 }}>
                    <View style={[styles.paragraph, { backgroundColor: color }]} />
                    <View style={[styles.paragraph, { backgroundColor: color }]} />
                </View>
            </Row>
        </View>
    ),
    movie: (color: string) => (
        <View style={styles.movieItem}>
            <View style={[styles.movieCover, { backgroundColor: color }]} />
            <View style={[styles.movieLabel, { marginVertical: pixel(3), width: pixel(40), backgroundColor: color }]} />
            <View style={[styles.movieLabel, { backgroundColor: color }]} />
        </View>
    ),
};

const START_VALUE = 0.5;
const END_VALUE = 1;
const DURATION = 500;

const movieWidth = (Device.WIDTH - pixel(Theme.edgeDistance) * 2 - pixel(20)) / 3;

const AnimatedView = ({ children }) => {
    const animation = new Animated.Value(START_VALUE);

    function start() {
        Animated.sequence([
            Animated.timing(animation, {
                toValue: END_VALUE,
                duration: DURATION,
                useNativeDriver: true,
            }),
            Animated.timing(animation, {
                toValue: START_VALUE,
                duration: DURATION,
                useNativeDriver: true,
            }),
        ]).start(e => {
            if (e.finished) {
                start();
            }
        });
    }

    start();
    const style = { opacity: animation };
    return <Animated.View style={style}>{children}</Animated.View>;
};

type args = {
    quantity?: number,
    color?: any,
    type?: 'post' | 'chat',
};

export default function Placeholder(props: args) {
    let quantity = props.quantity || 4;
    let color = props.color || Theme.groundColour;
    let type = props.type || 'post';
    return new Array(quantity).fill(0).map(function(elem, index) {
        return <AnimatedView key={index}>{render[type](color)}</AnimatedView>;
    });
}

const styles = StyleSheet.create({
    placeholder: {
        padding: pixel(Theme.edgeDistance),
    },
    avatar: {
        width: pixel(50),
        height: pixel(50),
        borderRadius: pixel(25),
        backgroundColor: Theme.groundColour,
        marginRight: pixel(10),
    },
    bigAvatar: { width: pixel(50), height: pixel(50), borderRadius: pixel(25) },
    strip: {
        width: pixel(80),
        height: pixel(20),
        borderRadius: pixel(4),
        backgroundColor: Theme.groundColour,
    },
    paragraph: {
        flex: 1,
        marginVertical: pixel(5),
        height: pixel(30),
        borderRadius: pixel(4),
        backgroundColor: Theme.groundColour,
    },
    content: {
        height: pixel(100),
        backgroundColor: Theme.groundColour,
        borderRadius: pixel(6),
        marginVertical: pixel(12),
    },
    label: {
        flex: 1,
        height: pixel(20),
        borderRadius: pixel(4),
        backgroundColor: Theme.groundColour,
    },
    movieItem: {
        width: movieWidth,
        marginRight: pixel(10),
        marginBottom: pixel(10),
    },
    movieCover: {
        height: movieWidth * 1.3,
        borderRadius: pixel(5),
    },
    movieLabel: {
        flex: 1,
        height: pixel(16),
        borderRadius: pixel(4),
        backgroundColor: Theme.groundColour,
    },
    group: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
