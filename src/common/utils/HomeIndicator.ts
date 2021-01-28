import { NativeModules, Platform } from 'react-native';
const isIOS = Platform.OS === 'ios';

const _RNHomeIndicator = isIOS ? NativeModules.RNHomeIndicator : null;
const setAutoHidden = (hidden: boolean) => {
    if (isIOS) {
        _RNHomeIndicator.setAutoHidden(hidden);
    } else {
        //leave empty for android and etc ..
    }
};
export default { setAutoHidden };
