import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Iconfont, StatusView, SpinnerLoading, ScrollTabBar, FocusAwareStatusBar } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Ritable from './RiCategorytable';
import Meitable from './MeiCategorytable';
import HKitable from './HKCategorytable';
import Hjitable from './HjCategorytable';
// table栏
export default function ApplicationMenuTable() {
    const navigation = useNavigation();
    const route = useRoute();
    const index = route.params?.index || [];

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
                <Iconfont name="fanhui" size={20} color="#000" />
            </TouchableOpacity>
            <ScrollableTabView
                style={{ flex: 1 }}
                initialPage={index}
                contentProps={{ keyboardShouldPersistTaps: 'always' }}
                renderTabBar={(props) => (
                    <ScrollTabBar
                        {...props}
                        tabWidth={pixel(66)}
                        style={styles.tabBarStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <Hjitable tabLabel="韩剧" />
                <Ritable tabLabel="日剧" />
                <Meitable tabLabel="美剧" />
                <HKitable tabLabel="港剧" />
            </ScrollableTabView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    goBack: {
        position: 'absolute',
        top: Theme.statusBarHeight + pixel(Theme.itemSpace),
        left: pixel(Theme.itemSpace),
        zIndex: 99,
    },
    tabBarStyle: {
        height: Theme.NAVBAR_HEIGHT,
        paddingHorizontal: pixel(42),
        backgroundColor: 'rgba(255,255,255,1)',
        marginTop: Theme.statusBarHeight,
    },
    underlineStyle: {
        width: pixel(26),
        height: pixel(3),
        left: (Device.WIDTH - pixel(63) * 4) / 2,
        bottom: pixel(5),
    },
    activeTextStyle: {
        color: '#323232',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    tintTextStyle: {
        color: '#525252',
        fontSize: font(16),
    },
});
