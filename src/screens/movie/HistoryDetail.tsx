import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Row, TouchFeedback } from '@src/components';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
// 观看历史详情
export default function HistoryDetail(props: any) {
    const { navigation, style } = props;
    const _renderItem = ({ item, index }) => {
        const movie = item.movie ?? {};
        const history = {
            series_index: item?.series_index,
            progress: item?.progress,
        };
        const count_series = movie?.count_series;
        let historyText = '尚未观看';
        if (history?.series_index > 0) {
            historyText = `看至第${history?.series_index + 1}集${Helper.moment(history?.progress)}`;
        } else if (history?.progress) {
            historyText = '看至' + Helper.moment(history?.progress);
        }
        return (
            <TouchFeedback onPress={() => navigation.navigate('MovieDetail', { movie, history })}>
                <View style={styles.content}>
                    <Image source={{ uri: movie.cover }} resizeMode="cover" style={styles.coverIcon} />
                    <View style={styles.name}>
                        <Text style={[styles.title]} numberOfLines={2}>
                            {movie.name}
                        </Text>
                        <View>
                            <Text style={[styles.series_historyTitle]}>{historyText}</Text>
                            <Row>
                                <Image
                                    style={[styles.columnIcon, { tintColor: '#BBBBBB' }]}
                                    source={require('@app/assets/images/icons/ic_mine_history.png')}
                                />
                                <Text style={[styles.favoriteSeries]}>{item.last_watch_time}</Text>
                            </Row>
                        </View>
                    </View>
                </View>
            </TouchFeedback>
        );
    };
    return (
        <View style={[styles.container, style]}>
            <QueryList
                gqlDocument={GQL.showMovieHistoryQuery}
                dataOptionChain="showMovieHistory.data"
                paginateOptionChain="showMovieHistory.paginatorInfo"
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
        marginBottom: pixel(Theme.itemSpace),
    },
    dateText: {
        fontSize: font(12),
    },
    coverIcon: {
        width: pixel(135),
        height: pixel(85),
    },
    columnIcon: {
        height: pixel(20),
        width: pixel(20),
        resizeMode: 'contain',
        marginRight: pixel(5),
    },
    name: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: pixel(5),
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
    series_historyTitle: {
        color: '#000',
        fontSize: font(12),
        marginBottom: pixel(5),
    },
});
