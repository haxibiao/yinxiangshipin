import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Linking,
    ViewStyle,
    FlatList,
    Animated,
    Easing,
    TouchableHighlight,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { ScrollView } from 'react-native-gesture-handler';

interface props {
    pageViewStyle: ViewStyle;
    categoryData: any;
    moduleTitle: string;
    hasMore: boolean;
    refetchMore: any;
}

const CategoryList = (props: Props) => {
    const { pageViewStyle, categoryData, hasMore, refetchMore, moduleTitle } = props;
    const [moreStatus, setMoreStatus] = useState(false);
    const [spinAction, setSpinAction] = useState(false);
    useEffect(() => {
        hasMore === true ? setMoreStatus(true) : setMoreStatus(false);
    }, []);
    const navigation = useNavigation();
    const navigateHandle = useCallback(
        (playUrl) => {
            // navigation.navigate('MoviePlayer', { playUrl });
            navigation.navigate('MovieDetail');
        },
        [navigation],
    );
    const spinValue = new Animated.Value(0);

    // First set up animation
    const spinTiming = useCallback(() => {
        spinValue.setValue(0);
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, []);

    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const spinFetchMore = useCallback(() => {
        spinTiming();
        refetchMore();
    }, [spinTiming, refetchMore]);

    return (
        <View style={[styles.pageView, { ...pageViewStyle }]}>
            <View style={styles.pageHead}>
                <Text style={styles.pageTitle}>{moduleTitle ? moduleTitle : '热门播放'}</Text>
                <Text style={styles.pageMore}>更多</Text>
            </View>
            <View style={styles.pageShow}>
                <FlatList
                    style={{ flexGrow: 1 }}
                    contentContainerStyle={{
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        width: maxWidth,
                    }}
                    horizontal={true}
                    data={categoryData}
                    renderItem={(item) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    navigateHandle(item.item.movieUrl);
                                }}>
                                <View style={styles.pageItem}>
                                    <Image
                                        style={styles.pageImage}
                                        resizeMode="cover"
                                        source={{ uri: item.item.cover }}
                                    />
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
                                        {item.item.movieTitle}
                                    </Text>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemDescription}>
                                        {item.item.description}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <TouchableOpacity
                onPress={() => {
                    spinFetchMore();
                }}>
                <View style={styles.pageFetchMore}>
                    <View style={styles.pageRefresh}>
                        <Animated.Image
                            style={[styles.refreshImage, { transform: [{ rotate: spin }] }]}
                            source={require('@app/assets/images/movie/refresh_icon.png')}></Animated.Image>
                        <Text style={styles.refreshText}>换一换</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const maxWidth = Device.WIDTH - pixel(20);

const styles = StyleSheet.create({
    pageView: {
        width: Device.WIDTH - pixel(20),
        borderRadius: pixel(5),
        borderBottomWidth: pixel(0.5),
        borderBottomColor: '#c8c8c8',
        borderTopWidth: pixel(0.5),
        borderTopColor: '#c8c8c8',
        paddingVertical: pixel(8),
    },
    pageHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    pageTitle: {
        fontSize: font(16),
        fontWeight: 'bold',
    },
    pageMore: {
        fontSize: font(14),
        color: '#c8c8c8',
    },
    pageShow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: pixel(10),
    },
    pageItem: {
        padding: 0,
        margin: 0,
    },
    pageImage: {
        width: maxWidth / 3 - pixel(8),
        height: pixel(145),
        borderRadius: pixel(5),
    },
    pageImage_colum: {
        height: pixel(95),
        width: maxWidth / 2 - pixel(8),
        borderRadius: pixel(5),
    },
    itemTitle: {
        marginVertical: pixel(3),
        fontSize: font(15),
        width: maxWidth / 3 - pixel(8),
    },
    itemDescription: {
        fontSize: font(12),
        color: '#c8c8c8',
        width: maxWidth / 3 - pixel(8),
    },
    itemDescription_colum: {
        fontSize: font(12),
        color: '#000',
        width: maxWidth / 2 - pixel(8),
        marginVertical: pixel(5),
    },
    pageRefresh: {
        flexDirection: 'row',
    },
    pageFetchMore: {
        width: maxWidth,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'skyblue',
    },
    refreshImage: {
        width: pixel(25),
        height: pixel(25),
    },
    refreshText: {
        lineHeight: pixel(25),
        color: '#d81e06',
    },
});

export default CategoryList;
