import React from 'react';
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
import { TabView } from '@src/components/ScrollHeaderTabView';
import UserProfile from './components/UserProfile';
import BottomBar from './components/BottomBar';
import Posts from './components/Posts';
import Likes from './components/Likes';

interface Props {
    tabs: string[];
}

const index = (props: Props) => {
    const [headerHeight, setHeaderHeight] = React.useState(pixel(200));
    const navigation = useNavigation();
    const route = useRoute();
    const user = route.params?.user || {};

    const headerOnLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setHeaderHeight(height);
    };

    const _renderScrollHeader = () => {
        return (
            <View onLayout={headerOnLayout}>
                <UserProfile user={user} />
            </View>
        );
    };

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
                        {user.name}
                    </Text>
                </Animated.View>

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => DeviceEventEmitter.emit('userOperation')}
                    style={[styles.navBarButton, { alignItems: 'flex-end' }]}>
                    <Iconfont name="qita1" size={pixel(22)} color={'#000'} />
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const _onChangeTab = (e: { from: number; curIndex: number }) => {};

    return (
        <View style={styles.container}>
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
                            // hiddenUnderLine={true}
                            tabWidth={pixel(64)}
                            underlineStyle={styles.underlineStyle}
                            tabStyle={styles.tabStyle}
                            style={styles.tabBarStyle}
                            activeTextStyle={styles.activeTextStyle}
                            tintTextStyle={styles.tintTextStyle}
                        />
                    )}
                    renderNavBar={_renderNavBar}
                    renderScrollHeader={_renderScrollHeader}
                    onChangeTab={_onChangeTab}>
                    <Posts user={user} label="发布" style={{ flex: 1, backgroundColor: '#FFF' }} />
                    <Likes user={user} label="喜欢" style={{ flex: 1, backgroundColor: '#FFF' }} />
                </TabView>
            </View>
            <BottomBar user={user} />
        </View>
    );
};

export default index;

const NAV_BAR_HEIGHT = pixel(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight);
const RIGHT_VIEW_WIDTH = pixel(50);

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
        paddingHorizontal: pixel(Theme.itemSpace),
        backgroundColor: '#fff',
    },
    navBarButton: {
        alignSelf: 'stretch',
        width: pixel(50),
        justifyContent: 'center',
    },
    navBarTitle: {
        alignSelf: 'center',
    },
    titleText: {
        color: '#000',
        fontSize: font(15),
    },
    tabBarStyle: {
        borderWidth: 0,
        height: pixel(40),
        backgroundColor: '#FFF',
    },
    tabStyle: {
        // marginRight: 0,
        // marginRight: pixel(20),
    },
    activeTextStyle: {
        color: '#212121',
        fontSize: font(19),
        fontWeight: 'bold',
    },
    tintTextStyle: {
        color: '#323232',
        fontSize: font(16),
    },
    underlineStyle: {
        bottom: pixel(10),
        // marginLeft: pixel(Theme.itemSpace),
        height: pixel(7),
        borderRadius: pixel(4),
        backgroundColor: 'rgba(5,132,255,0.8)',
    },
});
