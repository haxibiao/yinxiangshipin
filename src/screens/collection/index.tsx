import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Keyboard } from 'react-native';
import {
    TouchFeedback,
    Row,
    SafeText,
    NavBarHeader,
    StatusView,
    ListFooter,
    PageContainer,
    PullChooser,
} from '@src/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GQL } from '@src/apollo';
import { QueryList } from '@src/content';
import { userStore } from '@app/src/store';

export default function CollectionScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const user_id = route?.params?.user?.id || userStore.me.id;
    const isSelf = user_id === userStore.me.id;
    const onLongPress = useCallback(() => {
        Keyboard.dismiss();
        const operations = [];
        if (isSelf) {
            operations.push({
                title: '删除合集',
                onPress: () => {},
            });
        } else {
            operations.push({
                title: '收藏合集',
                onPress: () => {},
            });
        }

        PullChooser.show(operations);
    }, [isSelf]);
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.rowBoxItem}
                onPress={() =>
                    navigation.navigate('CollectionDetail', {
                        collection: { id: item.id, name: item.name, user: item.user },
                    })
                }
                onLongPress={onLongPress}>
                <Image source={{ uri: item.logo }} style={styles.logoImg} />
                <View style={{ flex: 1 }}>
                    <Row>
                        <Image
                            source={require('@app/assets/images/icons/ic_collection_gray.png')}
                            style={styles.collectionIcon}
                        />
                        <SafeText style={{ fontSize: font(14), fontWeight: 'bold', color: '#000' }} numberOfLines={1}>
                            {item.name}
                        </SafeText>
                    </Row>
                    <SafeText style={styles.collectionInfo} numberOfLines={1}>
                        1.2w播放·更新至第n集
                    </SafeText>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <PageContainer
            title="我的合集"
            titleStyle={{ fontSize: font(16) }}
            rightView={
                isSelf && (
                    <TouchFeedback onPress={() => navigation.navigate('创建合集')}>
                        <Text style={{ fontSize: font(14), color: Theme.navBarTitleColor || '#666' }}>创建</Text>
                    </TouchFeedback>
                )
            }>
            <QueryList
                gqlDocument={GQL.CollectionsQuery}
                dataOptionChain="collections.data"
                paginateOptionChain="collections.paginatorInfo"
                options={{
                    variables: {
                        user_id: user_id,
                    },
                    fetchPolicy: 'network-only',
                }}
                renderItem={renderItem}
                contentContainerStyle={styles.container}
            />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    rowBoxItem: {
        flexDirection: 'row',
        paddingHorizontal: pixel(Theme.itemSpace),
        paddingVertical: pixel(Theme.itemSpace),
        borderBottomWidth: pixel(0.5),
        borderColor: '#666',
        alignItems: 'center',
    },
    logoImg: {
        width: pixel(60),
        height: pixel(60),
        marginRight: pixel(Theme.itemSpace),
        resizeMode: 'cover',
        borderRadius: pixel(3),
    },
    collectionIcon: {
        width: pixel(12),
        height: pixel(12),
        resizeMode: 'cover',
        marginRight: pixel(3),
    },
    collectionInfo: {
        fontSize: font(11),
        marginTop: pixel(10),
        color: '#666',
    },
});
