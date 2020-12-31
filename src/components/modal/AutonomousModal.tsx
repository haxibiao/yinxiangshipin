import React, {
    useRef,
    useEffect,
    useState,
    useCallback,
    useImperativeHandle,
    ReactChildren,
    ReactNode,
    RefObject,
} from 'react';
import { StyleSheet, Modal, View, ViewStyle, ModalProps, Platform, Pressable, Animated, Easing } from 'react-native';
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

        // 控制器动画
        const opacityValue = useRef(new Animated.Value(0));
        const controllerBarSlideAnimation = useCallback((type: 'slideIn' | 'slideOut') => {
            const toValue = type === 'slideIn' ? 1 : 0;
            Animated.timing(opacityValue.current, {
                toValue,
                duration: 300,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => null);
        }, []);
        useEffect(() => {
            if (modalVisible) {
                controllerBarSlideAnimation('slideIn');
            } else {
                controllerBarSlideAnimation('slideOut');
            }
        }, [modalVisible]);

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={setModalVisible}
                statusBarTranslucent={true}
                hardwareAccelerated={true}
                {...modalProps}>
                <Pressable style={styles.shadowWrap} onPress={() => setModalVisible(false)}>
                    <Animated.View style={[styles.shadow, { opacity: opacityValue.current }]}></Animated.View>
                </Pressable>
                <View style={[styles.centeredView, style]}>{children(visible, setModalVisible)}</View>
                {/* <KeyboardSpacer /> */}
            </Modal>
        );
    },
);

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
    },
    shadowWrap: {
        position: 'absolute',
        ...StyleSheet.absoluteFillObject,
    },
    shadow: {
        flex: 1,
        backgroundColor: '#00000033',
    },
});
