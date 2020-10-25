import React, { ReactChild } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ad } from 'react-native-ad';
import { adStore } from '@src/store';
import Iconfont from '../Iconfont';
import { AutonomousModal, AutonomousModalProps } from './AutonomousModal';

interface Props extends AutonomousModalProps {
    showCloseButton?: Boolean;
    title: string;
    children: ReactChild;
}

export function Popover({ style, title, children, visible, onToggleVisible, ...modalProps }: Props) {
    return (
        <AutonomousModal animationType="fade" visible={visible} {...modalProps}>
            {(isVisible, toggleVisible) => (
                <View style={[styles.popoverContainer, style]}>
                    <View style={styles.popoverHeader}>
                        <Text style={styles.popoverTitle}>{title}</Text>
                        {showCloseButton && (
                            <TouchableOpacity style={styles.popoverClose} onPress={onToggleVisible} activeOpacity={1}>
                                <Iconfont name="guanbi1" size={font(20)} color={'#2b2b2b'} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.popoverContent}>{children}</View>
                    {adStore.enableAd && <ad.Feed codeid={adStore.codeid_feed} adWidth={Device.WIDTH * 0.7} />}
                    <TouchableOpacity style={styles.popoverClose} onPress={onToggleVisible} activeOpacity={1}>
                        <Text>我知道了</Text>
                    </TouchableOpacity>
                </View>
            )}
        </AutonomousModal>
    );
}

const styles = StyleSheet.create({
    popoverContainer: {
        width: Device.WIDTH * 0.7,
        minHeight: Device.WIDTH * 0.7,
        maxHeight: Device.HEIGHT * 0.5,
        paddingVertical: pixel(20),
        paddingHorizontal: pixel(16),
        borderRadius: pixel(10),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    popoverHeader: {
        paddingBottom: pixel(16),
    },
    popoverTitle: {
        color: '#212121',
        fontSize: font(16),
        lineHeight: font(20),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    popoverClose: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 0,
        right: 0,
        bottom: 0,
        width: pixel(44),
        height: pixel(44),
    },
    popoverContent: {
        flex: 1,
    },
});
