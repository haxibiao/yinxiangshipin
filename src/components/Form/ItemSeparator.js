/*
 * @flow
 * created by wyk made in 2019-01-10 11:57:47
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

function ItemSeparator(props: { height: number, color: any, style: any }) {
    const height = props.height || pixel(8);
    const color = props.color || Theme.groundColour;
    return <View style={[{ height, backgroundColor: color }, props.style]} />;
}

const styles = StyleSheet.create({});

export default ItemSeparator;
