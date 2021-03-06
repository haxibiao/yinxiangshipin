import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import GradientView from '../Basic/GradientView';
import SafeText from '../Basic/SafeText';
import { DebouncedPressable } from '../Basic/DebouncedPressable';

type Size = 'mini' | 'small' | 'medium' | 'default';

export interface Props {
    title?: string;
    theme?: string;
    gradient?: boolean;
    size?: Size;
    onPress?: (e: SyntheticEvent) => void;
    plain?: bool;
    icon?: bool;
    loading?: bool;
    disabled?: bool;
}

class HxfButton extends Component<Props, any> {
    public constructor(props: Props) {
        super(props);
    }

    public buildProps() {
        let { theme, size, plain, gradient, colors, ...others } = this.props;

        let buttonStyle, titleStyle;
        if (plain) {
            buttonStyle = {
                ...buttonLayout[size],
                borderWidth: pixel(1),
                borderColor: theme,
            };
            titleStyle = { ...buttonTitle[size], color: theme };
        } else {
            buttonStyle = { ...buttonLayout[size], backgroundColor: theme };
            titleStyle = { ...buttonTitle[size], color: '#fff' };
        }
        if (gradient && !Array.isArray(colors)) {
            colors = [Theme.primaryColor, Theme.secondaryColor];
        }
        return {
            buttonStyle,
            titleStyle,
            gradient,
            colors,
            ...others,
        };
    }

    public render() {
        const {
            gradient,
            style,
            buttonStyle,
            titleStyle,
            title,
            children,
            disabled,
            colors,
            loading,
            onPress,
        } = this.buildProps();
        const disabledBtn = disabled || loading;
        if (gradient) {
            return (
                <GradientView colors={disabledBtn ? ['#787878', '#a4a4a4'] : colors} style={[styles.buttonWrap, style]}>
                    <DebouncedPressable
                        style={[{ flex: 1 }, styles.buttonWrap]}
                        disabled={disabledBtn}
                        onPress={onPress}>
                        {loading ? (
                            <ActivityIndicator size={'small'} color="#fff" />
                        ) : (
                            children || <SafeText style={titleStyle}>{title}</SafeText>
                        )}
                    </DebouncedPressable>
                </GradientView>
            );
        }
        return (
            <DebouncedPressable
                style={[styles.buttonWrap, buttonStyle, style, disabledBtn && { backgroundColor: '#a8a8a8' }]}
                disabled={disabledBtn}
                onPress={onPress}>
                {loading ? (
                    <ActivityIndicator size={'small'} color="#fff" />
                ) : (
                    children || <SafeText style={titleStyle}>{title}</SafeText>
                )}
            </DebouncedPressable>
        );
    }
}

const styles = StyleSheet.create({
    buttonWrap: {
        alignItems: 'center',
        borderRadius: pixel(4),
        flexDirection: 'row',
        justifyContent: 'center',
        overflow: 'hidden',
    },
});

HxfButton.defaultProps = {
    theme: Theme.primaryColor,
    size: 'default',
    plain: false,
    icon: false,
    loading: false,
    disabled: false,
};

export default HxfButton;

const buttonLayout = {
    mini: {
        paddingVertical: pixel(4),
        paddingHorizontal: pixel(9),
    },
    small: {
        paddingVertical: pixel(6),
        paddingHorizontal: pixel(11),
    },
    medium: {
        paddingVertical: pixel(9),
        paddingHorizontal: pixel(14),
    },
    default: {
        paddingVertical: pixel(11),
        paddingHorizontal: pixel(17),
    },
};

const buttonTitle = {
    mini: {
        fontSize: font(13),
    },
    small: {
        fontSize: font(13),
    },
    medium: {
        fontSize: font(15),
    },
    default: {
        fontSize: font(16),
    },
};

const iconWrapStyle = {
    mini: {
        marginRight: pixel(2),
    },
    small: {
        marginRight: pixel(3),
    },
    medium: {
        marginRight: pixel(4),
    },
    default: {
        marginRight: pixel(5),
    },
};
