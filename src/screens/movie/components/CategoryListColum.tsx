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
    moduleTitle: any;
    navigationItem: Function;
    checkStyleName: string;
    checkNameColor: string;
    navigationAll: Function;
}

const CategoryListColum = (props: Props) => {
    const {
        pageViewStyle,
        categoryData,
        hasMore,
        refetchMore,
        moduleData,
        moduleTitle,
        navigationItem,
        checkStyleName,
        checkNameColor,
        navigationAll,
    } = props;
    const [moreStatus, setMoreStatus] = useState(false);
    const [spinAction, setSpinAction] = useState(false);
    const categoryArray = Array.isArray(categoryData);
    useEffect(() => {
        hasMore === true ? setMoreStatus(true) : setMoreStatus(false);
    }, [hasMore]);
    const navigation = useNavigation();
    const navigateHandle = useCallback(
        (movie_id) => {
            navigationItem ? navigationItem(movie_id) : console.log('呵呵,天真!!!');
        },
        [navigation, navigationItem],
    );

    // 换一换动画效果
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
    }, [spinValue]);

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
        categoryArray &&
        categoryData.length > 0 && (
            <View style={[styles.pageView, { ...pageViewStyle }]}>
                <TouchableOpacity
                    onPress={() => {
                        navigationAll();
                    }}>
                    <View style={styles.pageHead}>
                        <Text style={styles.pageTitle}>{moduleTitle ? moduleTitle : '精选剧场'}</Text>
                        {moreStatus && (
                            <Text
                                style={[
                                    styles.pageMore,
                                    checkNameColor ? { color: checkNameColor } : { color: '#c8c8c8' },
                                ]}>
                                {checkStyleName ? checkStyleName : '查看更多'}
                            </Text>
                        )}
                    </View>
                </TouchableOpacity>
                <View style={styles.pageShow}>
                    <FlatList
                        style={{ flexGrow: 1 }}
                        data={categoryData}
                        numColumns={2}
                        bounces={true}
                        renderItem={(item) => {
                            return (
                                <TouchableOpacity onPress={() => navigateHandle(item.item.id)}>
                                    <View style={{ marginRight: pixel(10), marginTop: 0, marginBottom: pixel(8) }}>
                                        <Image
                                            style={styles.pageImage_colum}
                                            resizeMode="cover"
                                            source={{ uri: item.item.cover }}
                                        />
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
                                            {item.item.name}
                                        </Text>
                                        <Text
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                            style={styles.itemDescription_colum}>
                                            {item.item.introduction}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        ListFooterComponent={
                            refetchMore && (
                                <TouchableOpacity
                                    onPress={() => {
                                        spinFetchMore();
                                    }}>
                                    <View style={styles.pageFetchMore}>
                                        <View style={styles.pageRefresh}>
                                            <Animated.Image
                                                style={[styles.refreshImage, { transform: [{ rotate: spin }] }]}
                                                source={require('@app/assets/images/movie/refresh_icon.png')}
                                            />
                                            <Text style={styles.refreshText}>换一换</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    />
                </View>
            </View>
        )
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
        width: (maxWidth - pixel(10)) / 3,
        height: pixel(145),
        borderRadius: pixel(5),
    },
    pageImage_colum: {
        height: pixel(95),
        width: (maxWidth - pixel(10)) / 2,
        borderRadius: pixel(5),
    },
    itemTitle: {
        marginVertical: pixel(3),
        fontSize: font(14),
        width: (maxWidth - pixel(10)) / 2,
        // backgroundColor: 'skyblue',
    },
    itemDescription: {
        fontSize: font(12),
        color: '#c8c8c8',
        width: (maxWidth - pixel(10)) / 3,
    },
    itemDescription_colum: {
        fontSize: font(12),
        color: '#000',
        width: (maxWidth - pixel(10)) / 2,
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
        width: pixel(24),
        height: pixel(24),
    },
    refreshText: {
        fontSize: font(13),
        lineHeight: pixel(25),
        color: '#d81e06',
    },
});

export default CategoryListColum;
