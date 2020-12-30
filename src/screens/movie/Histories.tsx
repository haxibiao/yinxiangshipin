import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '@src/components';
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
        <PageContainer title="观看记录">
            <View style={styles.container}>
                <QueryList
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    gqlDocument={GQL.showMovieHistoryQuery}
                    dataOptionChain="showMovieHistory.data"
                    paginateOptionChain="showMovieHistory.paginatorInfo"
                    options={{
                        fetchPolicy: 'network-only',
                    }}
                    renderItem={_renderItem}
                />
            </View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingTop: SPACE,
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
});
