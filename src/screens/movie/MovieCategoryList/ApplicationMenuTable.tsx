import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Iconfont, StatusView, SpinnerLoading, ScrollTabBar, FocusAwareStatusBar } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';

// table栏
export default function ApplicationMenuTable() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
                <Iconfont name="fanhui" size={20} color="#000" />
            </TouchableOpacity>
            <ScrollableTabView>
                <Text>111</Text>
                <Text>111</Text>
            </ScrollableTabView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
    goBack: {
        position: 'absolute',
        top: Theme.statusBarHeight,
        left: pixel(Theme.itemSpace),
        paddingTop: Theme.statusBarHeight - pixel(Theme.itemSpace) * 2,
        zIndex: 99,
    },
});
