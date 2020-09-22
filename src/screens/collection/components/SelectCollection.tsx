import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { QueryList, ContentStatus } from '@src/content';
import { Iconfont } from '@src/components';
import { GQL } from '@src/apollo';

export default ({ onClose, onClick, navigation }) => {
    const renderItem = useCallback(
        ({ item }) => {
            return <CollectionItem collection={item} navigation={navigation} onClick={onClick} btnName="添加" />;
        },
        [navigation],
    );

    return (
        <View style={styles.container}>
            <View style={styles.windowHeader}>
                <Text style={styles.headerText}>选择合集</Text>
                <TouchableOpacity style={styles.closeWindow} onPress={onClose}>
                    <Iconfont name="guanbi1" size={pixel(20)} color={Theme.defaultTextColor} />
                </TouchableOpacity>
            </View>
            <QueryList
                // gqlDocument={GQL.userPostsQuery}
                // dataOptionChain="userPosts.data"
                // paginateOptionChain="userPosts.paginatorInfo"
                // options={{
                //     variables: {
                //         user_id: route?.params?.user?.id,
                //         filter: 'spider',
                //     },
                //     fetchPolicy: 'network-only',
                // }}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.content}
            />
        </View>
    );
};

export function CollectionItem({ style, collection, navigation, onClick, btnName }) {
    return (
        <TouchableWithoutFeedback onPress={() => navigation.navigate('CollectionDetail', { collection })}>
            <View style={[styles.collectionItem, style]}>
                <Image
                    style={styles.collectionCover}
                    source={{ uri: collection?.cover?.url || 'http://cos.haxibiao.com/images/5f22a1fae6c3f.jpeg' }}
                />
                <View style={styles.collectionInfo}>
                    <View style={styles.introduction}>
                        <Text style={styles.collectionName} numberOfLines={2}>
                            {`${collection?.name || collection?.description}`}
                        </Text>
                    </View>
                    <Text style={styles.countPost}>{`共${collection?.count_post}个作品`}</Text>
                </View>
                {btnName && onClick && (
                    <TouchableOpacity style={styles.button} onPress={() => onClick(collection)}>
                        <Text style={styles.btnText}>{btnName}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        height: (Device.HEIGHT * 2) / 3,
        borderTopLeftRadius: pixel(12),
        borderTopRightRadius: pixel(12),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    content: {
        flexGrow: 1,
        paddingBottom: pixel(Theme.HOME_INDICATOR_HEIGHT),
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
    windowHeader: {
        alignItems: 'center',
        height: pixel(44),
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#f0f0f0',
    },
    headerText: {
        color: Theme.defaultTextColor,
        fontSize: pixel(15),
        fontWeight: 'bold',
    },
    closeWindow: {
        alignItems: 'center',
        bottom: 0,
        height: pixel(44),
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        top: 0,
        width: pixel(44),
    },
    listFooter: {
        paddingVertical: pixel(15),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listFooterText: {
        fontSize: font(13),
        color: '#b4b4b4',
    },
    collectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: pixel(12),
        paddingHorizontal: pixel(15),
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    collectionCover: {
        width: pixel(70),
        height: pixel(70),
        borderRadius: pixel(2),
    },
    collectionInfo: {
        flex: 1,
        marginHorizontal: pixel(12),
        justifyContent: 'space-between',
    },
    introduction: {
        marginBottom: pixel(4),
    },
    collectionName: {
        fontSize: font(15),
        lineHeight: font(20),
        color: '#2b2b2b',
    },
    countPost: {
        fontSize: font(14),
        color: '#b2b2b2',
    },
    button: {
        width: pixel(66),
        height: pixel(28),
        borderRadius: pixel(4),
        backgroundColor: '#FE2C54',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: font(14),
        color: '#fff',
        fontWeight: 'bold',
    },
});
