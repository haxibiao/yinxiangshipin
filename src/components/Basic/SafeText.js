import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TextStyle, Platform, TextProps } from 'react-native';

interface Props extends TextProps {
    shadow?: boolean;
    style?: TextStyle;
    children: any;
}

const SafeText = (props: Props) => {
    const { children, style, shadow, limit, ...other } = props;
    const [limited, setLimited] = useState(limit < String(children).length ? true : false);
    const onPress = useCallback(() => {
        setLimited(false);
    }, []);
    const clipText = useCallback(() => {
        if (Array.isArray(children)) {
            return String(children.join(',').substring(0, limit));
        } else {
            return String(children).substring(0, limit);
        }
    }, []);

    if (children !== null && children !== undefined && String(children).length > 0) {
        return (
            <Text {...other} style={[styles.fontFamily, style, shadow && styles.textShadow]}>
                {limited ? clipText(children) : children}
                {limited && '… '}
                {limited && (
                    <Text style={{ color: '#407FCF' }} onPress={onPress}>
                        展开全部
                    </Text>
                )}
            </Text>
        );
    }
    return null;
};

const styles = StyleSheet.create({
    fontFamily: {
        ...Platform.select({
            ios: {},
            android: {
                fontFamily: ' ',
            },
        }),
    },
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
});

export default SafeText;
