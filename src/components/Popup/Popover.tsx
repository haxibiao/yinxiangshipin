import React, { ReactChild } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Iconfont from '../Iconfont';

interface Props {
    style: ViewStyle;
    title: string;
    children: ReactChild;
    onClose: () => void;
}

export function Popover({ style, title, onClose, children }: Props) {
    return (
        <View style={[styles.popoverContainer, style]}>
            <View style={styles.popoverHeader}>
                <Text style={styles.popoverTitle}>{title}</Text>
                <TouchableOpacity style={styles.popoverClose} onPress={onClose} activeOpacity={1}>
                    <Iconfont name="guanbi1" size={pixel(20)} color={Theme.defaultTextColor} />
                </TouchableOpacity>
            </View>
            <View style={styles.popoverContent}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    popoverContainer: {
        flexGrow: 1,
        height: (Device.HEIGHT * 2) / 3,
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    popoverHeader: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    popoverTitle: {
        color: Theme.defaultTextColor,
        fontSize: pixel(15),
        fontWeight: 'bold',
        fontFamily: '',
    },
    popoverClose: {
        alignItems: 'center',
        bottom: 0,
        height: pixel(44),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        width: pixel(44),
    },
    popoverContent: {
        flex: 1,
    },
});
