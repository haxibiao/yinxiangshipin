import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, ScrollTabBar } from '@src/components';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Following from './society/Following';
import Follower from './society/Follower';
import { useNavigation, useRoute } from '@react-navigation/native';

const Society = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const user = route.params?.user || {};
    const follower = route.params?.follower || false;

    return (
        <PageContainer hiddenNavBar contentViewStyle={{ marginTop: Theme.statusBarHeight, backgroundColor: '#fff' }}>
            <ScrollableTabView
                initialPage={follower ? 1 : 0}
                renderTabBar={(props: any) => <ScrollTabBar {...props} tabUnderlineWidth={pixel(50)} />}>
                <Following tabLabel="关注" navigation={navigation} user={user} />
                <Follower tabLabel="粉丝" navigation={navigation} user={user} />
            </ScrollableTabView>
            <View style={styles.backButton}>
                <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
                    <Iconfont name="zuojiantou" color={Theme.defaultTextColor} size={pixel(21)} />
                </TouchFeedback>
            </View>
        </PageContainer>
    );
};

export default Society;

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Theme.NAVBAR_HEIGHT,
        height: Theme.NAVBAR_HEIGHT,
        justifyContent: 'center',
        paddingLeft: pixel(Theme.itemSpace),
    },
});
