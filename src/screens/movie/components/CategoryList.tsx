import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ViewStyle, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Props } from 'react-native-image-zoom-viewer/built/image-viewer.type';
import { ScrollView } from 'react-native-gesture-handler';

interface props {
    pageViewStyle: ViewStyle;
    pageColum: boolean;
    categoryData: any;
    hasMore: boolean;
}

const CategoryList = (props: Props) => {
    // https://neihandianying.com/movie/52188
    const { pageViewStyle, pageColum, categoryData, hasMore } = props;
    const [colum, setColum] = useState(false);
    const [moreStatus, setMoreStatus] = useState(false);
    console.log('pageColum', pageColum === true, colum, categoryData);
    useEffect(() => {
        pageColum === true ? setColum(true) : setColum(false);
        hasMore === true ? setMoreStatus(true) : setMoreStatus(false);
    }, [pageColum]);
    const navigation = useNavigation();
    const navigateHandle = useCallback(
        (playUrl) => {
            // Linking.openURL('https://neihandianying.com/movie/52188');
            navigation.navigate('MoviePlayer', { playUrl });
        },
        [navigation],
    );
    return !colum ? (
        <View style={[styles.pageView, { ...pageViewStyle }]}>
            <View style={styles.pageHead}>
                <Text style={styles.pageTitle}>title</Text>
                <Text style={styles.pageMore}>more</Text>
            </View>
            <View style={styles.pageShow}>
                <TouchableOpacity
                    onPress={() => {
                        navigateHandle('https://neihandianying.com/movie/52188');
                    }}>
                    <View style={styles.pageItem}>
                        <Image
                            style={styles.pageImage}
                            resizeMode="cover"
                            source={{ uri: 'https://mahuapic.com/upload/vod/2020-01-14/15789346381.jpg' }}
                        />
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
                            itemTitle
                        </Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemDescription}>
                            itemDescriptionitemDescriptionitemDescription
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.pageItem}>
                    <Image
                        style={styles.pageImage}
                        resizeMode="cover"
                        source={{ uri: 'https://mahuapic.com/upload/vod/2020-01-14/15789346381.jpg' }}
                    />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
                        itemTitle
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemDescription}>
                        itemDescriptionitemDescriptionitemDescription
                    </Text>
                </View>
                <View style={styles.pageItem}>
                    <Image
                        style={styles.pageImage}
                        resizeMode="cover"
                        source={{ uri: 'https://mahuapic.com/upload/vod/2020-01-14/15789346381.jpg' }}
                    />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemTitle}>
                        itemTitle
                    </Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemDescription}>
                        itemDescriptionitemDescriptionitemDescription
                    </Text>
                </View>
            </View>
            <View style={styles.pageFetchMore}>
                <View style={styles.pageRefresh}>
                    <Image style={styles.refreshImage} source={require('@app/assets/images/movie/refresh_icon.png')} />
                    <Text style={styles.refreshText}>换一换</Text>
                </View>
            </View>
        </View>
    ) : (
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
                        console.log(item);
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
                            <View style={styles.pageFetchMore}>
                                <View style={styles.pageRefresh}>
                                    <Image
                                        style={styles.refreshImage}
                                        source={require('@app/assets/images/movie/refresh_icon.png')}
                                    />
                                    <Text style={styles.refreshText}>换一换</Text>
                                </View>
                            </View>
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
        // height: pixel(275),
        width: Device.WIDTH - pixel(20),
        borderRadius: pixel(5),
        borderBottomWidth: pixel(0.5),
        borderBottomColor: '#c8c8c8',
        borderTopWidth: pixel(0.5),
        borderTopColor: '#c8c8c8',
        // paddingTop: pixel(8),
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
