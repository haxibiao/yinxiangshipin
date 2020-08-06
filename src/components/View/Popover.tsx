import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';

const Popover = (props: any) => {
    const { isShow, options, selected, selectHandler } = props;

    return (
        <View
            style={{
                opacity: isShow ? 1 : 0,
                zIndex: isShow ? 1 : -1,
            }}>
            <View style={styles.triangle} />
            <View style={styles.popoverBox}>
                {options.map((item, index) => (
                    <TouchableOpacity onPress={() => selectHandler(index)}>
                        <View style={[styles.row, index < options.length - 1 && styles.line]}>
                            <Text style={styles.text}>{item}</Text>
                            {selected === index && (
                                <Image source={require('@app/assets/images/check.png')} style={styles.selectedIcon} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default Popover;

const styles = StyleSheet.create({
    line: {
        borderBottomColor: '#fff',
        borderBottomWidth: pixel(0.5),
    },
    popoverBox: {
        backgroundColor: '#000',
        borderRadius: pixel(4),
        paddingHorizontal: pixel(4),
        width: Device.WIDTH * 0.3,
        // width: pixel(100),
    },
    row: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: pixel(12),
        width: pixel(100) - pixel(4) * 2,
    },
    selectedIcon: {
        height: pixel(10),
        resizeMode: 'cover',
        width: pixel(12),
    },
    text: {
        color: '#fff',
        fontSize: font(10),
        lineHeight: font(14),
    },
    triangle: {
        borderBottomColor: '#000',
        borderBottomWidth: 4,
        borderColor: 'transparent',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        height: 0,
        marginLeft: pixel(65),
        marginTop: -4,
        width: 0,
    },
});
