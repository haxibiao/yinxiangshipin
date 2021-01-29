import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, Pressable, ScrollView } from 'react-native';
import { observer, adStore } from '@src/store';
import { GQL, useQuery } from '@src/apollo';
import CollectionItem, { POSTER_WIDTH } from './CollectionItem';
import { Iconfont, StatusView } from '@app/src/components';
import MovieItemWithTime from '@src/screens/movie/components/MovieItemWithTime';
import MovieItemRecord from './MovieItemRecord';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Props {
    user: any;
    categoryName?: string;
}

const SPACE = pixel(14);

const MovieRequireRecord = observer((props: Props) => {
    const { user } = props;
    const navigation = useNavigation();
    const { data: mySeekMovies } = useQuery(GQL.mySeekMoviesQuery, {
        variables: {
            user_id: user.id,
            fetchPolicy: 'network-only',
        },
    });
    const mySeekMoviesData = useMemo(() => mySeekMovies?.mySeekMovies.data || new Array(10).fill({}), [mySeekMovies]);
    return (
        <View style={styles.secContainer}>
            <View style={styles.secHead}>
                <View style={styles.headLeft}>
                    <Iconfont name="wenji" color="#909090" size={font(15)} />
                    <Text style={styles.secTitle}>所求电影/剧</Text>
                </View>
                {mySeekMoviesData?.length > 3 && (
                    <Pressable
                        style={styles.headRight}
                        onPress={() => navigation.navigate('FavoriteCollection', { user })}>
                        <Text style={styles.secAll}>查看全部</Text>
                        <Iconfont name="right" style={{ marginTop: font(1) }} size={font(12)} color={'#909090'} />
                    </Pressable>
                )}
            </View>
            <ScrollView style={{ marginRight: -SPACE }} horizontal={true} showsHorizontalScrollIndicator={false}>
                {mySeekMoviesData.map((item, index) => {
                    return <MovieItemRecord navigation={navigation} key={index} recordData={item} />;
                })}
                {mySeekMoviesData.length === 0 && (
                    <View style={styles.emptyView}>
                        <Image
                            style={styles.emptyImage}
                            source={require('@app/assets/images/default/common_empty_default.png')}
                        />
                        <Text style={styles.emptyText}>此处空空如也</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    secContainer: {
        padding: SPACE,
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    secHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: pixel(10),
    },
    headLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secTitle: {
        fontSize: font(15),
        color: '#404040',
        marginLeft: pixel(4),
    },
    headRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secAll: {
        fontSize: font(13),
        color: '#909090',
        marginRight: font(-1),
    },
    createBtnWrap: {
        width: POSTER_WIDTH,
    },
    createBtn: {
        width: POSTER_WIDTH,
        height: POSTER_WIDTH,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eee',
        borderRadius: pixel(5),
    },
    createText: {
        color: '#202020',
        lineHeight: font(20),
        fontSize: font(14),
    },
    emptyView: {
        width: Device.width,
        height: POSTER_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        width: POSTER_WIDTH - font(20),
        height: POSTER_WIDTH - font(20),
    },
    emptyText: {
        color: '#909090',
        fontSize: font(13),
        lineHeight: font(20),
    },
    itemWrap: {
        marginRight: pixel(14),
    },
});

export default MovieRequireRecord;
