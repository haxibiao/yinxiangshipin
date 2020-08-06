'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Image, PixelRatio, ViewProps } from 'react-native';

type Props = {
    size?: number;
    style?: typeof ViewProps;
    source: any;
};

class Avatar extends Component<Props> {
    static defaultProps = {
        size: pixel(44),
        style: {},
    };

    constructor(props: any) {
        super(props);

        this.state = {
            loading: true,
        };
    }

    render() {
        let { source, size, style } = this.props;
        let avatar = {
            width: size,
            height: size,
            borderRadius: PixelRatio.roundToNearestPixel(size / 2),
            backgroundColor: '#f9f9f9',
        };
        if (typeof source === 'string') {
            source = { uri: source };
        }
        return <Image source={source} resizeMode="cover" style={[avatar, style]} onError={this._onError} />;
    }

    _onError = () => {
        this.setState({
            loading: false,
        });
    };
}

const styles = StyleSheet.create({});

export default Avatar;
