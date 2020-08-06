import React, { Component } from 'react';
import { View, StatusBar, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Screen = (props: any) => {
    const { customStyle = {}, lightBar, header = false, leftComponent = false } = props;
    const routs = useRoute();
    if (routs.params?.auth && TOKEN === null) {
        return <ActivityIndicator />;
    }
    return (
        <View
            style={[
                {
                    flex: 1,
                    backgroundColor: '#ffffff',
                },
                customStyle,
            ]}>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={lightBar ? 'light-content' : 'dark-content'}
            />
            {props.children}
        </View>
    );
};

export default Screen;
