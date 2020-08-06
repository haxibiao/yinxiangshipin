import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Props {
    onFocus?: (params?: any) => any;
    onBlur?: (params?: any) => any;
}

export const useNavigationListener = (props: Props) => {
    const navigation = useNavigation();
    const { onFocus, onBlur } = props;

    useEffect(() => {
        const navFocusListener = navigation.addListener('focus', () => {
            if (typeof onFocus === 'function') {
                onFocus();
            }
        });
        const navBlurListener = navigation.addListener('blur', () => {
            if (typeof onBlur === 'function') {
                onBlur();
            }
        });
        return () => {
            navFocusListener();
            navBlurListener();
        };
    }, [onFocus, onBlur]);
};
