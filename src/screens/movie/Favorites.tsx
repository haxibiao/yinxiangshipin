import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PageContainer } from '@src/components';
import { QueryList } from '@src/content';
import { userStore } from '@src/store';
import { GQL } from '@src/apollo';
import MediaItem, { SPACE } from './components/MediaItem';

export default function Favorites(props: any) {
    const navigation = useNavigation();
    const _renderItem = ({ item, index }) => {
        const movie = item.movie ?? {};
        return <MediaItem movie={movie} />;
    };

    return (
        <PageContainer title="我的追剧">
            <View style={styles.container}>
                <QueryList
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
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
