import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { PageContainer, NavBarHeader, Iconfont, ScrollTabBar } from '@src/components';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Following from './parts/Following';
import Follower from './parts/Follower';
import { useNavigation, useRoute } from '@react-navigation/native';

const FollowedUser = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const user = route.params?.user || {};
    const follower = route.params?.follower || false;

    return (
        <View style={styles.container}>
            <ScrollableTabView
                initialPage={follower ? 1 : 0}
                renderTabBar={(props: any) => <ScrollTabBar {...props} tabUnderlineWidth={pixel(50)} />}>
                <Following tabLabel="关注" navigation={navigation} user={user} />
                <Follower tabLabel="粉丝" navigation={navigation} user={user} />
            </ScrollableTabView>
            <NavBarHeader
                navBarStyle={styles.navBarStyle}
                hasGoBackButton={true}
                StatusBarProps={{ barStyle: 'dark-content' }}
            />
        </View>
    );
};

export default FollowedUser;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Device.navBarHeight,
    },
    navBarStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: pixel(42),
    },
});
