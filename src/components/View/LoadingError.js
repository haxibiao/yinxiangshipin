import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const IMAGE_WIDTH = Device.width * 0.6;

class LoadingError extends Component {
    render() {
        let { size = 70, fontSize = 16, reload = () => null, children } = this.props;
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('@app/assets/images/default/common_error_default.png')} />
                {children ? (
                    children
                ) : (
                    <Text
                        style={{
                            fontSize,
                            marginVertical: 15,
                        }}>
                        哎呀,好像出了点问题
                    </Text>
                )}
                <TouchableOpacity onPress={reload}>
                    <Text style={styles.reload}>重新加载( ´◔ ‸◔`)</Text>
                </TouchableOpacity>
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
    },
    image: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH / 2,
        resizeMode: 'contain',
    },
    reload: {
        fontSize: font(15),
        textAlign: 'center',
    },
});

export default LoadingError;
