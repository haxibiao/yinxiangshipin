import React, { ReactChild } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Iconfont from '../Iconfont';

interface Props {
    style: ViewStyle;
    title: string;
    children: ReactChild;
    onClose: () => void;
}

export function Drawer({ style, title, onClose, children }: Props) {
    return (
        <View style={[styles.drawerContainer, style]}>
            <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>{title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={1}>
                    <Iconfont name="guanbi1" size={pixel(20)} color={Theme.defaultTextColor} />
                </TouchableOpacity>
            </View>
            <View style={styles.drawerContent}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContainer: {
        flexGrow: 1,
        height: (Device.height * 2) / 3,
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        paddingBottom: Device.bottomInset,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    drawerHeader: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    drawerTitle: {
        color: Theme.defaultTextColor,
        fontSize: pixel(15),
        fontWeight: 'bold',
        fontFamily: '',
    },
    closeButton: {
        alignItems: 'center',
        bottom: 0,
        height: pixel(44),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        width: pixel(44),
    },
    drawerContent: {
        flex: 1,
    },
});
