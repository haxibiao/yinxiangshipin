import { useEffect } from 'react';
import { Keyboard,Platform } from 'react-native';

type Listener = (e: any) => any;

export const useKeyboardListener = (onKeyboardShow: Listener, onKeyboardHide: Listener) => {

    useEffect(() => {
        const showListenerName = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const showListener = Keyboard.addListener(showListenerName, e => onKeyboardShow(e));
        const hideListenerName = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        const hideListener = Keyboard.addListener(hideListenerName, e => onKeyboardHide(e));
        return () => { 
            showListener.remove();
            hideListener.remove();
        };
    }, []);
};
