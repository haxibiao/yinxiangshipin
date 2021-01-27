import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavBarHeader } from '@src/components';
import { QueryList } from '@src/content';
import { GQL } from '@src/apollo';
import MediaItem, { SPACE } from './components/MediaItem';

export default function Histories(props: any) {
    const navigation = useNavigation();
    const _renderItem = ({ item, index }) => {
        const movie = item.movie ?? {};
        movie.last_watch_time = item?.last_watch_time;
        return <MediaItem movie={movie} infoStyle={{ justifyContent: 'center' }} />;
    };

    return (
        <View style={styles.container}>
            <NavBarHeader title="播放记录" hasGoBackButton={true} StatusBarProps={{ barStyle: 'dark-content' }} />
            <QueryList
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                gqlDocument={GQL.showMovieHistoryQuery}
                dataOptionChain="showMovieHistory.data"
                paginateOptionChain="showMovieHistory.paginatorInfo"
                renderItem={_renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flexGrow: 1,
        paddingTop: SPACE,
        paddingBottom: pixel(Theme.bottomInset),
    },
});
