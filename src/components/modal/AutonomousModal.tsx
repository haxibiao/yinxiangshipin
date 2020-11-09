import React, {
    useEffect,
    useState,
    useCallback,
    useImperativeHandle,
    ReactChildren,
    ReactNode,
    RefObject,
} from 'react';
import { StyleSheet, Modal, View, ViewStyle, ModalProps, Platform } from 'react-native';
import KeyboardSpacer from '../Other/KeyboardSpacer';

const useControllableProp = ({ value, updater, defaultValue }) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState(isControlled ? value : defaultValue);
    const currentValue = isControlled ? value : internalValue;
    const currentUpdater = isControlled ? updater : setInternalValue;

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
        const [modalVisible, setModalVisible] = useControllableProp({
            value: visible,
            updater: onToggleVisible,
            defaultValue: false,
        });

        useImperativeHandle(
            ref,
            () => ({
                visible,
                onToggle: setModalVisible,
            }),
            [setModalVisible],
        );
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={setModalVisible}
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                {...modalProps}>
                <View style={[styles.centeredView, style]}>{children(visible, setModalVisible)}</View>
                {/* <KeyboardSpacer /> */}
            </Modal>
        );
    },
);

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
