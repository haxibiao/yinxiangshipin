import React, { Component } from 'react';
import { StyleSheet, View, Modal, Platform, StatusBar } from 'react-native';
import KeyboardSpacer from '../Other/KeyboardSpacer';

class HxfModal extends Component {
    render() {
        const { visible, handleVisible, header, children, customStyle = {}, animationType = 'fade' } = this.props;
        const mergeStyle = StyleSheet.flatten([styles.modalInner, customStyle]);
        return (
            <Modal animationType={animationType} transparent={true} visible={visible} onRequestClose={handleVisible}>
                <View
                    style={[styles.modalShade, animationType == 'slide' && { justifyContent: 'flex-end' }]}
                    onStartShouldSetResponder={evt => true}
                    onResponderStart={handleVisible}
                    onStartShouldSetResponderCapture={evt => false}>
                    <StatusBar backgroundColor={visible ? 'rgba(105,105,105,0.7)' : '#fff'} barStyle="dark-content" />
                    <View style={mergeStyle} onStartShouldSetResponder={evt => true}>
                        {header ? <View style={styles.modalHeader}>{header}</View> : null}
                        {children}
                    </View>
                </View>
                {Platform.OS == 'ios' && <KeyboardSpacer />}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalHeader: {
        paddingBottom: 20,
    },
    modalInner: {
        backgroundColor: '#f8f8f8',
        borderRadius: 3,
        padding: 20,
        width: Device.WIDTH - 40,
    },
    modalShade: {
        alignItems: 'center',
        backgroundColor: 'rgba(105,105,105,0.7)',
        flex: 1,
        justifyContent: 'center',
    },
});

export default HxfModal;
