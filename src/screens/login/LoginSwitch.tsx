import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MobileLogin from './MobileLogin';
import AccountLogin from './AccountLogin';

const LoginSwitch = () => {
    const [switchStatus, setSwitchStatus] = useState();
    const route = useRoute();
    const navigation = useNavigation();
    const routeStatus = route?.params?.switchStatus;
    useEffect(() => {
        setSwitchStatus(routeStatus);
    }, [setSwitchStatus, routeStatus]);
    return switchStatus ? <AccountLogin /> : <MobileLogin setSwitchStatus={setSwitchStatus} />;
};

export default LoginSwitch;
