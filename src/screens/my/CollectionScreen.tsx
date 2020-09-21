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

export default function CollectionScreen() {
    const navigation = useNavigation();
    let collectionData = [
        { id: 1, title: '云画的月光', logo: require('@app/assets/images/login_cover.png') },
        { id: 2, title: '恶之花', logo: require('@app/assets/images/login_cover.png') },
        { id: 3, title: '便利店新星', logo: require('@app/assets/images/login_cover.png') },
    ];
    const hasMorePages = false;
    const hiddenListFooter = collectionData && collectionData.length === 0;
    const isSelf = true;
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
                        tag: { id: 1127, name: item.title },
                        user_name: 'sengki',
                    })
                }
                onLongPress={onLongPress}>
                <Image source={item.logo} style={styles.logoImg} />
                <View style={{ flex: 1 }}>
                    <Row>
                        <Image
                            source={require('@app/assets/images/icons/ic_mine_collect.png')}
                            style={styles.collectionIcon}
                        />
                        <SafeText style={{ fontSize: font(14), fontWeight: 'bold', color: '#000' }} numberOfLines={1}>
                            {item.title}
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
            <FlatList
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                data={collectionData}
                keyExtractor={(item, index) => String(item.id || index)}
                renderItem={renderItem}
                ListEmptyComponent={() => (
                    <StatusView.EmptyView imageSource={require('@app/assets/images/default_comment.png')} />
                )}
                ListFooterComponent={() => <ListFooter hidden={hiddenListFooter} finished={!hasMorePages} />}
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
    },
    collectionInfo: {
        fontSize: font(11),
        marginTop: pixel(10),
        color: '#666',
    },
});
