import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NavBarHeader } from '@src/components';
import { QueryList } from '@src/content';
import { userStore } from '@src/store';
import { GQL } from '@src/apollo';
import MediaItem, { SPACE } from './components/MediaItem';

export default function Favorites() {
    const route = useRoute();
    const navigation = useNavigation();
    const user = route.params?.user;
    const isSelf = user?.id === userStore.me.id;
    const _renderItem = ({ item, index }) => {
        const movie = item.movie ?? {};
        return <MediaItem movie={movie} />;
    };

    return (
        <View style={styles.container}>
            <NavBarHeader
                title={isSelf ? '我的追剧' : 'TA的追剧'}
                hasGoBackButton={true}
                StatusBarProps={{ barStyle: 'dark-content' }}
            />
            <QueryList
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                gqlDocument={GQL.favoritedMoviesQuery}
                dataOptionChain="myFavorite.data"
                paginateOptionChain="myFavorite.paginatorInfo"
                options={{
                    variables: {
                        user_id: user.id,
                        type: 'movies',
                    },
                    fetchPolicy: 'network-only',
                }}
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
        paddingBottom: pixel(Device.bottomInset),
    },
});
