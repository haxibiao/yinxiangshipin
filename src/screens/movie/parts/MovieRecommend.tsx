import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
    Easing,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { GQL, useQuery } from '@src/apollo';
import { Iconfont, DebouncedPressable } from '@src/components';

const POSTER_WIDTH = (Device.WIDTH - pixel(43)) / 2;
const POSTER_HEIGHT = POSTER_WIDTH * 0.62;

interface MovieProps {
    movie: {
        id: string;
        cover: string;
        name: string;
        introduction: string;
        count_series: string;
    };
    navigation: {
        navigate: (p1: String, p2?: any) => void;
    };
}

function MovieItem({ movie, navigation }: MovieProps) {
    const hits = movie?.hits;

    if (!movie?.id) {
        return <MovieItemPlaceholder />;
    }

    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('MovieDetail', { movie })}>
            <View style={styles.movieContent}>
                <ImageBackground style={styles.movieCover} i resizeMode="cover" source={{ uri: movie?.cover }}>
                    {hits > 0 && (
                        <ImageBackground
                            style={styles.picLabel}
                            source={require('@app/assets/images/movie/ic_movie_tag_pink.png')}>
                            <Text style={styles.picLabelText} numberOfLines={1}>
                                热播
                            </Text>
                        </ImageBackground>
                    )}
                    <LinearGradient
                        style={styles.picBt}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        colors={['#00000044', '#00000033', '#00000028', '#00000011', '#00000000']}>
                        <View style={{ flex: 1 }}>
                            {movie?.count_series > 1 && (
                                <Text style={styles.picText} numberOfLines={1}>
                                    共{movie?.count_series}集
                                </Text>
                            )}
                        </View>
                    </LinearGradient>
                </ImageBackground>
                <View style={styles.movieInfo}>
                    <Text style={styles.movieName} numberOfLines={1}>
                        {movie?.name || ''}
                    </Text>
                    <Text style={styles.movieDesc} numberOfLines={1}>
                        {movie?.introduction || `${Helper.count(Number(movie?.id) * 100)}次播放`}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

interface Props {
    count?: number;
    categoryName?: number;
}

export default ({ count = 4, categoryName = '正在热播' }: Props) => {
    const { data, refetch, loading, error } = useQuery(GQL.recommendMovieQuery, {
        variables: { count },
        fetchPolicy: 'network-only',
    });
    const moviesData = useMemo(() => data?.recommendMovie || new Array(count).fill({}), [data]);
    const navigation = useNavigation();

    const [isRotating, setIsRotating] = useState(false);
    const rotateValue = useRef(new Animated.Value(0));
    const rotate = rotateValue.current.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    const startRotating = useCallback(() => {
        setIsRotating(true);
        Animated.loop(
            Animated.timing(rotateValue.current, {
                toValue: 1,
                duration: 720,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start();
    }, []);
    const refreshState = useRef({
        start: 0,
        end: 0,
        timer: null,
    });
    const stopRotating = useCallback(() => {
        if (refreshState.current.timer) {
            clearTimeout(refreshState.current.timer);
        }
        const interval = Math.max(180, 720 - (refreshState.current.end - refreshState.current.start));
        refreshState.current.timer = setTimeout(() => {
            rotateValue.current.stopAnimation(() => {
                rotateValue.current.setValue(0);
                setIsRotating(false);
            });
        }, interval);
    }, []);

    const refreshHandler = useCallback(async () => {
        if (!loading && refetch instanceof Function) {
            refreshState.current.start = new Date().getTime();
            startRotating();
            await refetch();
            refreshState.current.end = new Date().getTime();
            stopRotating();
        }
    }, [refetch, loading]);

    if (!moviesData?.length) {
        return <View style={styles.secContainer} />;
    }

    return (
        <View style={styles.secContainer}>
            <View style={styles.secHead}>
                <Text style={styles.secTitle}>{categoryName}</Text>
                <View style={styles.headRight}>
                    <Image
                        source={require('@app/assets/images/movie/ic_hot_orange.png')}
                        style={styles.recommendIcon}
                    />
                    <Text style={styles.rightText}>甄选奉上</Text>
                </View>
            </View>
            <View style={styles.movieList}>
                {moviesData.map((item, index) => {
                    return (
                        <View style={styles.itemWrap} key={item?.id || index}>
                            <MovieItem movie={item} navigation={navigation} />
                        </View>
                    );
                })}
            </View>
            <DebouncedPressable style={styles.secFoot} disabled={isRotating} onPress={refreshHandler}>
                <Animated.View style={{ transform: [{ rotate }], marginBottom: -pixel(2) }}>
                    <Iconfont name="shuaxin" size={font(16)} color={Theme.primaryColor} />
                </Animated.View>
                <Text style={styles.refreshText}>换一换</Text>
            </DebouncedPressable>
        </View>
    );
};

function MovieItemPlaceholder() {
    const animation = new Animated.Value(0.5);
    const animationStyle = { opacity: animation };

    (function startAnimation() {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0.5,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    })();

    return (
        <View style={styles.movieContent}>
            <Animated.View style={[styles.movieCover, animationStyle]} />
            <View style={styles.movieInfo}>
                <Animated.View style={[styles.placeholderName, animationStyle]} />
                <Animated.View style={[styles.placeholderDesc, animationStyle]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    secContainer: {
        padding: pixel(14),
        paddingBottom: 0,
        borderBottomWidth: pixel(1),
        borderBottomColor: '#f4f4f4',
    },
    secHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    secTitle: {
        fontSize: font(16),
        color: '#202020',
        fontWeight: 'bold',
    },
    headRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recommendIcon: {
        width: font(15),
        height: font(15),
        marginRight: pixel(2),
    },
    rightText: {
        fontSize: font(12),
        color: '#ff7f02',
    },
    movieList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: pixel(-14),
    },
    itemWrap: {
        marginTop: pixel(15),
        marginRight: pixel(14),
        width: POSTER_WIDTH,
    },
    secFoot: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: pixel(14),
    },
    refreshText: {
        marginLeft: pixel(4),
        fontSize: font(13),
        color: Theme.primaryColor,
    },
    movieContent: {},
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
    picBt: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: pixel(10),
        paddingBottom: pixel(4),
        paddingHorizontal: pixel(8),
    },
    picText: {
        color: '#fff',
        lineHeight: font(14),
        fontSize: font(11),
    },
    movieInfo: {
        marginTop: pixel(5),
        minHeight: font(42),
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
    movieDesc: {
        color: '#909090',
        lineHeight: font(20),
        fontSize: font(12),
    },
});
