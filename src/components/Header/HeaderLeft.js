import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import Iconfont from '../Iconfont';

const HeaderLeft = (props: any) => {
    const navigation = useNavigation();
    const route = useRoute();
    const { color = Theme.defaultTextColor, children, goBack = true } = props;

    return (
        <View style={styles.headerLeft}>
            {goBack && (
                <TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
                    <Iconfont name="fanhui" size={23} color={color} />
                </TouchableOpacity>
            )}
            {children}
        </View>
    );
};

export default HeaderLeft;

const styles = StyleSheet.create({
    goBack: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        width: 40,
    },
    headerLeft: {
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 15,
    },
});
