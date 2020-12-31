import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';

import { Colors } from '@src/common';
const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width / 3;

class BlankContent extends Component {
    render() {
        let { size = 70, fontSize = 16, customStyle = {}, remind = '这里还木有内容哦 ~', children } = this.props;
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('@app/assets/images/default/common_empty_default.png')} />
                {children ? (
                    children
                ) : (
                    <Text style={{ fontSize, color: Theme.tintFontColor, marginTop: 12 }}>{remind}</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: Theme.navBarBackground,
    },
    image: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH,
        resizeMode: 'contain',
    },
});

export default BlankContent;
