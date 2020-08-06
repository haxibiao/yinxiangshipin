import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';

const animation = require('../../common/loadinganimation.json');

export interface Props {
    size: number;
    type: string;
    isVisible: boolean;
}

export default function SpinnerLoading(props: Props) {
    let { size = 70, type = 'ThreeBounce', isVisible = true } = props;
    return (
        <View style={styles.container}>
            <LottieView source={animation} autoPlay loop style={{ width: '60%', height: 100 }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
