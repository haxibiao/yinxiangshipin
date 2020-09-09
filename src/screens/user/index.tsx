import React, { useState, useMemo, useCallback } from 'react';
import {
    TouchableOpacity,
    Image,
    StyleSheet,
    View,
    Text,
    StatusBar,
    Animated,
    ScrollView,
    DeviceEventEmitter,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Iconfont, ScrollTabBar } from '@src/components';
import { userStore } from '@src/store';
import { TabView } from '@src/components/ScrollHeaderTabView';
import UserProfile from './components/UserProfile';
import Posts from './components/Posts';
import Likes from './components/Likes';

interface Props {
    tabs: string[];
}

const index = (props: Props) => {
    const [headerHeight, setHeaderHeight] = useState(pixel(250));
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const user = route.params?.user;

    const isSelf = useMemo(() => userStore.me.id === user.id, []);

    const headerOnLayout = useCallback((event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    }, []);

    const _onChangeTab = useCallback((e: { from: number; curIndex: number }) => {
        setActiveTabIndex(e.curIndex);
    }, []);

    const _renderScrollHeader = useCallback(() => {
        return (
            <View onLayout={headerOnLayout}>
                <UserProfile user={user} isSelf={isSelf} />
            </View>
        );
    }, [user, isSelf]);

    const goToSearch = useCallback(() => {
        navigation.push('SearchVideo', {
            user_id: user.id,
        });
    }, []);

    const _renderNavBar = (animation: any): React.ReactElement => {
        const headerOpacity = animation.interpolate({
            inputRange: [0, headerHeight - NAV_BAR_HEIGHT * 2, headerHeight - NAV_BAR_HEIGHT],
            outputRange: [0, 0, 1],
        });
        return (
            <Animated.View style={[styles.navBarContainer, { opacity: headerOpacity }]}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        navigation.goBack();
                    }}
                    style={styles.navBarButton}>
                    <Iconfont name="zuojiantou" color={'#000'} size={pixel(22)} />
                </TouchableOpacity>
                <Animated.View style={styles.navBarTitle}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {user?.name}
                    </Text>
                </Animated.View>
                <View style={styles.rightButtons}>
                    <TouchableOpacity activeOpacity={1} onPress={goToSearch} style={styles.navBarButton}>
                        <Iconfont name="fangdajing" size={pixel(22)} color={'#000'} />
                    </TouchableOpacity>
                    {!isSelf && (
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => DeviceEventEmitter.emit('userOperation')}
                            style={styles.navBarButton}>
                            <Iconfont name="daohanggengduoanzhuo" size={pixel(22)} color={'#000'} />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <TabView
                    averageTab={false}
                    tabBarStyle={{ borderTopWidth: 1, borderColor: '#e8e8ec' }}
                    navBarHeight={NAV_BAR_HEIGHT}
                    makeHeaderHeight={() => {
                        return headerHeight;
                    }}
                    renderTabBar={(tabBarProps: any) => (
                        <ScrollTabBar
                            {...tabBarProps}
                            activeTab={activeTabIndex}
                            style={styles.tabStyle}
                            tabStyle={styles.tabBarStyle}
                            tabWidth={tabWidth}
                            tabUnderlineWidth={tabUnderlineWidth}
                            underlineStyle={styles.underlineStyle}
                            activeTextStyle={styles.activeTextStyle}
                            tintTextStyle={styles.tintTextStyle}
                        />
                    )}
                    renderNavBar={_renderNavBar}
                    renderScrollHeader={_renderScrollHeader}
                    onChangeTab={_onChangeTab}>
                    <Posts user={user} label="发布" style={styles.listContainer} />
                    <Likes user={user} label="喜欢" style={styles.listContainer} />
                </TabView>
            </View>
        </View>
    );
};

export default index;

const NAV_BAR_HEIGHT = pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight);

const tabWidth = Device.WIDTH / 2;
const tabUnderlineWidth = pixel(20);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: NAV_BAR_HEIGHT,
        paddingTop: pixel(Theme.statusBarHeight),
        backgroundColor: '#fff',
    },
    rightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navBarButton: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: pixel(12),
    },
    navBarTitle: {
        position: 'absolute',
        top: pixel(Theme.statusBarHeight),
        bottom: 0,
        left: pixel(100),
        right: pixel(100),
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        color: '#000',
        fontSize: font(15),
    },
    tabStyle: {
        height: pixel(40),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
        justifyContent: 'center',
    },
    tabBarStyle: {
        flex: 1,
    },
    activeTextStyle: {
        color: '#212121',
        fontSize: font(18),
        fontWeight: 'bold',
    },
    tintTextStyle: {
        color: '#212121',
        fontSize: font(16),
    },
    underlineStyle: {
        left: (tabWidth - tabUnderlineWidth) / 2,
        bottom: pixel(1),
        height: pixel(2),
        borderRadius: pixel(1),
        backgroundColor: 'rgba(254,25,102,0.8)',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
});
