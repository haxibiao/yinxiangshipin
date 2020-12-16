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
    hasMore: boolean;
    refetchMore: any;
    moduleData: any;
}

const CategoryListColum = (props: Props) => {
    const { pageViewStyle, categoryData, hasMore, refetchMore, moduleData } = props;
    const [moreStatus, setMoreStatus] = useState(false);
    const [spinAction, setSpinAction] = useState(false);
    useEffect(() => {
        hasMore === true ? setMoreStatus(true) : setMoreStatus(false);
    }, [hasMore]);
    const navigation = useNavigation();
    const navigateHandle = useCallback(
        (playUrl) => {
            navigation.navigate('MoviePlayer', { playUrl });
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
                <Text style={styles.pageTitle}>title</Text>
                {moreStatus ? <Text style={styles.pageMore}>more</Text> : <Text />}
            </View>
            <View style={styles.pageShow}>
                <FlatList
                    style={{ flexGrow: 1 }}
                    data={categoryData}
                    numColumns={2}
                    bounces={true}
                    contentContainerStyle={{ justifyContent: 'space-between', alignItems: 'center' }}
                    renderItem={(item) => {
                        return (
                            <TouchableOpacity onPress={() => navigateHandle(item.item.movieUrl)}>
                                <View style={{ marginHorizontal: pixel(5), marginTop: 0, marginBottom: pixel(8) }}>
                                    <Image
                                        style={styles.pageImage_colum}
                                        resizeMode="cover"
                                        source={{ uri: item.item.cover }}
                                    />
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
                                        {item.item.movieTitle}
                                    </Text>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.itemDescription_colum}>
                                        {item.item.description}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListFooterComponent={
                        moreStatus ? (
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
                        ) : (
                            <View />
                        )
                    }
                />
            </View>
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

export default CategoryListColum;
