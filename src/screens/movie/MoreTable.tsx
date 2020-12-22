import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, ScrollTabBar } from '@src/components';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import HistoryTab from './HistoryDetail';
import MyFavoriteTab from './MyFavoriteDetail';
// 更多table栏
export default function MoreTable() {
    const navigation = useNavigation();
    const route = useRoute();
    const style = { marginTop: pixel(5) };
    const follower = route.params?.follower || false;

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
                <Iconfont name="fanhui" size={20} color="#000" />
            </TouchableOpacity>
            <ScrollableTabView
                style={{ flex: 1 }}
                initialPage={follower ? 1 : 0}
                contentProps={{ keyboardShouldPersistTaps: 'always' }}
                renderTabBar={(props) => (
                    <ScrollTabBar
                        {...props}
                        tabWidth={pixel(120)}
                        style={styles.tabBarStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <HistoryTab tabLabel="观影历史" navigation={navigation} style={style} />
                <MyFavoriteTab tabLabel="我的收藏" navigation={navigation} style={style} />
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
        paddingHorizontal: pixel(25),
        backgroundColor: 'rgba(255,255,255,1)',
        marginTop: Theme.statusBarHeight,
    },
    underlineStyle: {
        width: pixel(40),
        height: pixel(3),
        left: pixel(25) + pixel(80) / 2,
        bottom: pixel(5),
    },
    activeTextStyle: {
        color: '#323232',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    tintTextStyle: {
        color: '#525252',
        fontSize: font(13),
    },
});
