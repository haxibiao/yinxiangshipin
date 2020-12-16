import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ScrollTabBar, Iconfont, StatusView, SpinnerLoading } from '@src/components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GQL, useQuery } from '@src/apollo';
import VideoContent from './components/VideoContent';
import CommentContent from './components/CommentContent';

export default function MovieDetail() {
    const navigation = useNavigation();
    const route = useRoute();
    const movie_id = route.params?.movie_id || Math.round(Math.random() * 10);
    const { loading, error, data, fetchMore, refetch } = useQuery(GQL.movieQuery, {
        variables: {
            movie_id: movie_id,
        },
    });
    const movie = useMemo(() => Helper.syncGetter('movie', data), [data]);
    if (error) return <StatusView.ErrorView onPress={refetch} error={error} />;
    if (loading) return <SpinnerLoading />;

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
