/*
 * @flow
 * created by wyk made in 2018-12-13 11:43:52
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Overlay } from 'teaset';
import { SafeText } from '../Basic';
import { ItemSeparator } from '../Form';

type ChooserItem = {
    title: string,
    onPress: Function,
};

type AnimateType = 'slide' | 'pop';

let OverlayKey: any = null;

const show = (Choose: Array<ChooserItem>, animateType: AnimateType = 'slide') => {
    let overlayView;
    if (animateType === 'pop') {
        overlayView = (
            <Overlay.PopView
                containerStyle={{ backgroundColor: 'transparent' }}
                style={{ flexDirection: 'column', justifyContent: 'center' }}
                animated>
                <View style={styles.popSheetView}>
                    <FlatList
                        bounces={false}
                        scrollEnabled={false}
                        contentContainerStyle={styles.chooseContainer}
                        data={Choose}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.chooserItem}
                                    onPress={() => {
                                        hide();
                                        item.onPress();
                                    }}>
                                    <SafeText style={styles.chooserItemText}>{item.title}</SafeText>
                                </TouchableOpacity>
                            );
                        }}
                        ItemSeparatorComponent={() => <ItemSeparator height={pixel(1)} />}
                        keyExtractor={(item, index) => 'key_' + (item.id ? item.id : index)}
                    />
                </View>
            </Overlay.PopView>
        );
    } else {
        overlayView = (
            <Overlay.PullView
                containerStyle={{ backgroundColor: 'transparent' }}
                style={{ flexDirection: 'column', justifyContent: 'flex-end' }}
                animated>
                <View style={styles.actionSheetView}>
                    <FlatList
                        bounces={false}
                        scrollEnabled={false}
                        contentContainerStyle={styles.chooseContainer}
                        data={Choose}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    key={index}
                                    style={styles.chooserItem}
                                    onPress={() => {
                                        hide();
                                        item.onPress();
                                    }}>
                                    <SafeText style={styles.chooserItemText}>{item.title}</SafeText>
                                </TouchableOpacity>
                            );
                        }}
                        ItemSeparatorComponent={() => <ItemSeparator height={pixel(1)} />}
                        keyExtractor={(item, index) => 'key_' + (item.id ? item.id : index)}
                    />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.closeItem}
                        onPress={() => {
                            hide();
                        }}>
                        <Text style={styles.headerText}>取消</Text>
                    </TouchableOpacity>
                </View>
            </Overlay.PullView>
        );
    }

    OverlayKey = Overlay.show(overlayView);
};

const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    actionSheetView: {
        marginBottom: Device.bottomInset,
        overflow: 'hidden',
        padding: pixel(Theme.edgeDistance),
    },
    popSheetView: {
        marginBottom: Device.bottomInset,
        overflow: 'hidden',
        padding: pixel(Theme.edgeDistance * 2),
    },
    chooseContainer: {
        backgroundColor: '#fff',
        borderRadius: pixel(6),
    },
    chooserItem: {
        height: pixel(50),
        justifyContent: 'center',
    },
    chooserItemText: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        textAlign: 'center',
    },
    closeItem: {
        height: pixel(46),
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: pixel(6),
        marginTop: pixel(Theme.edgeDistance),
    },
    headerText: {
        fontSize: font(16),
        color: Theme.confirm,
        textAlign: 'center',
    },
});

export default { show, hide };
