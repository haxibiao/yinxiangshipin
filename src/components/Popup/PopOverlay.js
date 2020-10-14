/*
 * @flow
 * created by wyk made in 2019-01-08 13:06:22
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Overlay } from 'teaset';
import SafeText from '../Basic/SafeText';
import TouchFeedback from '../Basic/TouchFeedback';

type args = {
    title?: string,
    content: any,
    onConfirm: Function,
    leftContent: string,
    rightContent: string,
    leftConfirm: Function,
    modal: boolean,
};

function renderContent(content) {
    if (typeof content === 'string') {
        return <Text style={styles.messageText}>{content}</Text>;
    } else {
        return content;
    }
}

function PopOverlay(props: args) {
    let { title, content, onConfirm, leftContent, rightContent, leftConfirm, modal } = props,
        popViewRef,
        overlayView;
    overlayView = (
        <Overlay.PopView
            style={{ alignItems: 'center', justifyContent: 'center' }}
            modal={modal}
            animated
            ref={(ref) => (popViewRef = ref)}>
            <View style={styles.overlayInner}>
                <SafeText style={styles.headerText}>{title || '提示'}</SafeText>
                {content && renderContent(content)}
                <View style={styles.footer}>
                    <TouchFeedback
                        style={styles.cancel}
                        onPress={() => {
                            popViewRef.close();
                            leftConfirm && leftConfirm();
                        }}>
                        <Text style={styles.cancelText}>{leftContent || '取消'}</Text>
                    </TouchFeedback>
                    <View style={styles.line} />
                    <TouchFeedback
                        style={styles.confirm}
                        onPress={() => {
                            onConfirm && onConfirm();
                            popViewRef.close();
                        }}>
                        <Text style={styles.confirmText}>{rightContent || '确定'}</Text>
                    </TouchFeedback>
                </View>
            </View>
        </Overlay.PopView>
    );
    Overlay.show(overlayView);
}

const styles = StyleSheet.create({
    line: {
        width: StyleSheet.hairlineWidth,
        marginVertical: pixel(10),
        alignSelf: 'stretch',
        backgroundColor: '#f0f0f0',
    },
    cancel: {
        flex: 1,
        justifyContent: 'center',
    },
    cancelText: {
        textAlign: 'center',
        fontSize: font(16),
        color: '#b2b2b2',
        borderRightWidth: pixel(1),
        borderRightColor: Theme.borderColor,
    },
    confirm: {
        flex: 1,
        justifyContent: 'center',
    },
    confirmText: {
        textAlign: 'center',
        fontSize: font(16),
        color: Theme.primaryColor,
    },
    footer: {
        height: pixel(46),
        flexDirection: 'row',
        alignItems: 'stretch',
        borderTopWidth: pixel(1),
        borderTopColor: '#f0f0f0',
    },
    headerText: {
        fontSize: font(19),
        color: '#212121',
        textAlign: 'center',
    },
    messageText: {
        fontSize: font(16),
        lineHeight: font(20),
        marginVertical: pixel(20),
        color: '#212121',
        textAlign: 'center',
    },
    overlayInner: {
        width: percent(80),
        paddingTop: pixel(20),
        paddingHorizontal: pixel(20),
        backgroundColor: '#fff',
        borderRadius: pixel(6),
    },
});

export default PopOverlay;
