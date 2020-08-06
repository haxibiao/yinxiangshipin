/*
 * @flow
 * created by wyk made in 2018-12-18 15:46:45
 */
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

interface Props {
    onChangeText: (e: string) => any;
    defaultValue?: string;
    value: string;
    style?: Object;
    [key: string]: any;
}

const HxfTextInput = React.forwardRef((props: Props, ref) => {
    const { style, ...others } = props;
    return <TextInput ref={ref} style={[styles.inputStyle, style]} {...others} />;
});

HxfTextInput.defaultProps = {
    underlineColorAndroid: 'transparent',
    placeholderTextColor: '#b2b2b2',
    selectionColor: Theme.primaryColor,
    textAlignVertical: 'center',
};

const styles = StyleSheet.create({
    inputStyle: {
        fontSize: font(14),
        color: '#2b2b2b',
        paddingTop: 0,
        padding: 0,
        margin: 0,
    },
});

export default HxfTextInput;
