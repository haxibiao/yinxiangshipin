import React, { Component, ReactChild } from 'react';
import { StyleSheet, View, Text, Animated, Easing, ViewStyle, TextStyle } from 'react-native';

type positionValue = 'top' | 'center' | 'bottom';

interface Option {
    content: ReactChild;
    layout?: positionValue;
    duration?: number;
    callback?: () => void;
}

interface Props {
    style?: ViewStyle;
    textStyle?: TextStyle;
    fadeInDuration?: number;
    fadeOutDuration?: number;
    showDuration?: number;
}

interface State {
    isShow: boolean;
    content: any;
    opacity: any;
}

class Toast extends Component<Props, State> {
    static defaultProps = {
        fadeInDuration: 300,
        fadeOutDuration: 400,
        showDuration: 1200,
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            isShow: false,
            content: null,
            opacity: new Animated.Value(1),
        };
    }

    show(option: Option = {}) {
        this.positionValue = option.layout || 'center';
        const duration = option.duration || this.props.showDuration;
        const content = option.content;
        const callback = option.callback;
        if (this.isShow) {
            setTimeout(() => {
                this.show({ duration, content, callback });
            }, 1900);
            return;
        }
        this.isShow = true;
        this.state.opacity.setValue(0);
        this.setState({ content, isShow: true });
        Animated.sequence([
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: this.props.fadeInDuration,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.delay(duration),
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: this.props.fadeOutDuration,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start(() => {
            this.setState({ content: null, isShow: false });
            this.isShow = false;
            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    render() {
        const { isShow, opacity, content } = this.state;
        const { style, textStyle } = this.props;
        let position;
        switch (this.positionValue) {
            case 'top':
                position = { top: pixel(Theme.NAVBAR_HEIGHT + 100) };
                break;
            case 'center':
                position = { top: pixel(Device.HEIGHT - 120) / 2 };
                break;
            case 'bottom':
                position = { bottom: pixel(Theme.HOME_INDICATOR_HEIGHT + 100) };
                break;
        }
        const ToastView = isShow ? (
            <View style={[styles.container, position]} pointerEvents="none">
                <Animated.View style={[styles.toast, { opacity }, style]}>
                    {React.isValidElement(content) ? (
                        content
                    ) : (
                        <Text style={[styles.content, textStyle]}>{content}</Text>
                    )}
                </Animated.View>
            </View>
        ) : null;
        return ToastView;
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10000,
        alignItems: 'center',
    },
    toast: {
        maxWidth: '50%',
        backgroundColor: 'rgba(32,30,51,0.7)',
        borderRadius: pixel(5),
        paddingVertical: pixel(8),
        paddingHorizontal: pixel(10),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        fontSize: font(14),
        lineHeight: font(24),
        color: '#fff',
        textAlign: 'center',
    },
});

export default Toast;
