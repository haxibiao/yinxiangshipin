import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { TouchFeedback } from '@src/components';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import { userStore } from '@src/store';

// 我的收藏
export default function MyFavoriteDetail(props: any) {
    const { navigation } = props;
    const _renderItem = ({ item, index }) => {
        return (
            <TouchFeedback onPress={() => navigation.navigate('MovieDetail', { movie_id: item.movie.id })}>
                <View style={styles.content}>
                    <Image source={{ uri: item.movie.cover }} resizeMode="cover" style={styles.coverIcon} />
                    <View style={styles.name}>
                        <Text style={[styles.title]} numberOfLines={2}>
                            {item.movie.name}
                        </Text>
                        <Text style={[styles.user]}>主演:{item.movie.producer}</Text>
                        <Text style={[styles.title, { color: '#F3583F' }]}>
                            {item.movie.region}·{item.movie.year}
                        </Text>

                        <Text style={[styles.favoriteSeries]}>已更新{item.movie.count_series}集</Text>
                    </View>
                </View>
            </TouchFeedback>
        );
    };
    return (
        <View style={styles.container}>
            <QueryList
                gqlDocument={GQL.favoritedMoviesQuery}
                dataOptionChain="myFavorite.data"
                paginateOptionChain="myFavorite.paginatorInfo"
                options={{
                    variables: {
                        user_id: userStore.me.id,
                        type: 'movies',
                    },
                    fetchPolicy: 'network-only',
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
                renderItem={_renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: pixel(Theme.itemSpace),
    },
    favoriteSeries: {
        color: '#BBBBBB',
        fontSize: font(12),
    },
    content: {
        flexDirection: 'row',
        marginTop: pixel(Theme.itemSpace),
    },
    dateText: {
        fontSize: font(12),
    },
    coverIcon: {
        width: pixel(135),
        height: pixel(85),
        borderRadius: pixel(5),
    },
    columnIcon: {
        height: pixel(20),
        width: pixel(20),
        resizeMode: 'contain',
    },
    name: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: pixel(8),
    },
    contentContainerStyle: {
        paddingHorizontal: pixel(Theme.itemSpace),
    },
    title: {
        color: '#000',
        fontSize: font(12),
        paddingRight: pixel(5),
        fontWeight: 'bold',
    },
    user: {
        fontSize: font(12),
        lineHeight: pixel(18),
        color: '#333',
        fontWeight: 'normal',
    },
});
