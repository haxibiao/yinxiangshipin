'use strict';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Porps = {
    start?: any,
    end?: any,
    locations?: Array,
    colors?: Array,
    style?: any,
};
class GradientView extends Component<Porps> {
    static defaultProps = {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        locations: [0.2, 1],
        colors: [Theme.primaryColor, Theme.secondaryColor],
    };

    render() {
        let { children, ...other } = this.props;
        return <LinearGradient {...other}>{children}</LinearGradient>;
    }
}

const styles = StyleSheet.create({});

export default GradientView;
