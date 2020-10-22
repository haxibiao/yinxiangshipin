import React, { useState, useCallback, useImperativeHandle, ReactChildren, ReactNode, RefObject } from 'react';
import { StyleSheet, Modal, View, ViewStyle, ModalProps, Platform } from 'react-native';
import KeyboardSpacer from '../Other/KeyboardSpacer';

const useControllableProp = ({ value, updater, defaultValue }) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(isControlled ? value : defaultValue);
    const currentValue = isControlled ? value : internalValue;
    const currentUpdater = isControlled ? updater : (e) => setInternalValue(e);

    useEffect(() => {
        if (isControlled) {
            setInternalValue(value);
        }
    }, [isControlled, value]);

    return [currentValue, currentUpdater];
};

export interface AutonomousModalProps extends ModalProps {
    style?: ViewStyle;
    onToggleVisible: (v: boolean) => void;
    children: (v: boolean, f: (v: boolean) => void) => ReactChildren;
}

export const AutonomousModal = React.forwardRef(
    ({ style, visible, onToggleVisible, children, ...modalProps }: AutonomousModalProps, ref: RefObject) => {
        const [modalVisible, toggleModalVisible] = useControllableProp({
            value: visible,
            updater: onToggleVisible,
            defaultValue: false,
        });

        useImperativeHandle(
            ref,
            () => ({
                visible,
                onToggle: toggleModalVisible,
            }),
            [toggleModalVisible],
        );

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModalVisible}
                {...modalProps}>
                <View style={[styles.centeredView, style]}>{children(visible, toggleModalVisible)}</View>
                {/* <KeyboardSpacer /> */}
            </Modal>
        );
    },
);

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
