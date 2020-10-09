import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Iconfont from '../Iconfont';

class Button extends Component {
    render() {
        const {
            style = {},
            outline, // 镂空按钮
            theme = Theme.themeColor, // 边框/背景/文字颜色
            name,
            fontSize = 16,
            icon, // 自定义icon
            iconName, // iconName
            iconSize = fontSize,
            handler,
            disabled = false,
        } = this.props;
        const mergeButton = StyleSheet.flatten([
            styles.button,
            { borderColor: theme },
            !outline && { backgroundColor: theme },
            style,
            disabled && { opacity: 0.5 },
        ]);
        return (
            <TouchableOpacity onPress={handler} style={mergeButton} disabled={disabled}>
                {icon
                    ? icon
                    : iconName && <Iconfont name={iconName} size={iconSize} color={outline ? theme : '#fff'} />}
                <Text style={[{ fontSize, color: theme }, !outline && { color: '#fff' }]}>{name}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 4,
        borderWidth: 1,
    },
});

export default Button;
