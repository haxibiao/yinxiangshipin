import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import MovieItemWithTime from '@src/screens/movie/components/MovieItemWithTime';
import index from '../../Feedback/FeedbackDetail';

const POSTER_WIDTH = Device.width / 3;
const POSTER_HEIGHT = POSTER_WIDTH * 0.64;

interface recordProps {
    navigation: any;
    recordData: {
        id: String;
        images: any;
        status: String;
        movies: Object;
        name: String;
        description: String;
    };
}

export default function MovieItemRecord({ recordData, navigation }: recordProps) {
    const movies = recordData.movies;
    return movies?.length > 0 ? (
        movies.map((item, index) => {
            const movie = item?.movie || {};
            return (
                <MovieItemWithTime
                    showLastWatch={false}
                    style={styles.itemWrap}
                    key={item?.id || index}
                    movie={item}
                    navigation={navigation}
                />
            );
        })
    ) : recordData?.images ? (
        <View style={{}}>
            <ImageBackground
                style={styles.movieCover}
                i
                resizeMode="cover"
                source={{ uri: recordData?.images[0].path }}>
                <ImageBackground
                    style={styles.picLabel}
                    source={require('@app/assets/images/movie/ic_movie_tag_sky.png')}>
                    <Text style={styles.picLabelText} numberOfLines={1}>
                        想看
                    </Text>
                </ImageBackground>
            </ImageBackground>
            <View style={styles.movieInfo}>
                <Text style={styles.movieName} numberOfLines={1}>
                    {recordData?.name || ''}
                </Text>
            </View>
        </View>
    ) : (
        <View></View>
    );
}

const styles = StyleSheet.create({
    movieCover: {
        position: 'relative',
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        borderRadius: pixel(8),
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.24,
                shadowRadius: pixel(8),
                shadowOffset: {
                    width: 0,
                    height: pixel(3),
                },
            },
            android: {
                elevation: 6,
            },
        }),
    },
    movieInfo: {
        marginTop: pixel(5),
    },
    placeholderName: {
        width: '60%',
        height: font(15),
        borderRadius: font(5),
        marginTop: font(6),
        backgroundColor: '#f0f0f0',
    },
    placeholderDesc: {
        width: '90%',
        height: font(15),
        borderRadius: font(5),
        marginTop: font(6),
        backgroundColor: '#f0f0f0',
    },
    movieName: {
        color: '#202020',
        lineHeight: font(22),
        fontSize: font(14),
    },
    picLabel: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: (font(19) * 64) / 34,
        height: font(19),
        paddingHorizontal: pixel(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    picLabelText: {
        color: '#fff',
        lineHeight: font(14),
        fontSize: font(11),
    },
    itemWrap: {
        marginRight: pixel(14),
    },
});
