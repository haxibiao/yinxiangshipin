import React, { useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollTabBar, Iconfont } from '@src/components';
import { useNavigation } from '@react-navigation/native';
import VideoContent from './components/VideoContent';
import CommentContent from './components/CommentContent';

export default function MovieDetail() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} style={styles.goBack} onPress={() => navigation.goBack()}>
                <Iconfont name="fanhui" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.moviePlayer} />
            <ScrollableTabView
                style={{ flex: 1 }}
                renderTabBar={(props) => (
                    <ScrollTabBar
                        {...props}
                        tabWidth={pixel(60)}
                        style={styles.tabBarStyle}
                        tabStyle={styles.tabStyle}
                        underlineStyle={styles.underlineStyle}
                        activeTextStyle={styles.activeTextStyle}
                        tintTextStyle={styles.tintTextStyle}
                    />
                )}>
                <VideoContent tabLabel="视频" movie={movie} />
                <CommentContent tabLabel="讨论" movie={movie} />
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
        zIndex: 99,
    },
    moviePlayer: {
        height: Device.WIDTH * 0.6,
        backgroundColor: '#000',
    },
    tabBarStyle: {
        height: pixel(42),
        paddingHorizontal: pixel(Theme.itemSpace),
        backgroundColor: 'rgba(255,255,255,1)',
        borderBottomWidth: pixel(0.5),
        borderColor: '#f0f0f0',
    },
    tabStyle: {
        alignItems: 'flex-start',
    },
    underlineStyle: {
        width: pixel(20),
        left: pixel(Theme.itemSpace) + pixel(5),
    },
    activeTextStyle: {
        color: '#212121',
        fontSize: font(16),
        fontWeight: 'bold',
    },
    tintTextStyle: {
        color: '#666',
        fontSize: font(16),
    },
});

const movie = {
    id: 24612,
    cover: 'https://r1.ykimg.com/052600005D230490425BD935255B9C83',
    title: '狐妖小红娘',
    description:
        '《狐妖小红娘》的故事围绕人与妖之间的爱情展开。根据古典小说记载，世上有人有妖，妖会与人相恋，妖寿命千万年，人的寿命有限，人死了，妖活着。人会投胎转世，但投胎以后，不记得上辈子的爱。妖如果痴情的话，就去找狐妖“购买”一项服务，让投胎转世的人，回忆起前世的爱。狐妖红娘这一个角色就这样诞生，作品主要讲述了以红娘为职业的狐妖在为前世恋人牵红线过程当中发生的一系列有趣、神秘的故事。',
    latestEpisode: 3,
    totalEpisodes: 112,
    count_comments: 1000,
    updateTime: '每周三更新',
    user: {
        id: '51',
        name: '匿名用户',
        avatar: 'http://yinxiangshipin-1254284941.cos.ap-guangzhou.myqcloud.com/storage/avatar/avatar-1.jpg',
    },
};
