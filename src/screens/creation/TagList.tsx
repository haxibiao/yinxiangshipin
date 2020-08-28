import React, { useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { QueryList, PostItem, GQL } from '@src/content';
import { FocusAwareStatusBar } from '@src/router';
import { useQuery } from '@apollo/react-hooks';
import { NavBarHeader } from '@src/components';
import { userStore } from '@src/store';
import { count } from '@src/common';
import { Overlay } from 'teaset';
import AddTag from './AddTag';

const TagItem = (props) => {
    const { tagData, selectTag, navigation } = props;
    const onClick = useCallback(() => {
        selectTag(tagData);
        navigation.goBack();
    }, [tagData]);

    return (
        <TouchableOpacity style={styles.tagItem} onPress={onClick}>
            <View style={styles.tagNameWrap}>
                <Text style={styles.tagName}>#{tagData?.name}</Text>
            </View>
            <Text style={styles.countPlays}>{count(tagData?.count_plays)}次播放</Text>
        </TouchableOpacity>
    );
};

export default () => {
    const route = useRoute();
    const navigation = useNavigation();
    const selectTag = useMemo(() => {
        return route.params?.selectTag;
    }, []);

    const openAddTagModal = useCallback(() => {
        let overlayRef;
        const Operation = (
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center' }}
                ref={(ref) => (overlayRef = ref)}>
                <AddTag
                    selectTag={selectTag}
                    onClose={() => {
                        overlayRef.close();
                        navigation.goBack();
                    }}
                />
            </Overlay.PopView>
        );
        Overlay.show(Operation);
    }, [selectTag]);

    const { data: userTagsData } = useQuery(GQL.userTags, {
        variables: { id: userStore.me.id },
    });
    const tagsData = useMemo(() => userTagsData?.user?.tags?.data, [userTagsData]);
    const renderUserTags = useMemo(() => {
        if (tagsData?.length > 0) {
            return (
                <View style={styles.userTags}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>常用标签</Text>
                    </View>
                    <View style={styles.tagList}>
                        {tagsData.map((tag, index) => (
                            <TouchableOpacity
                                key={tag?.id}
                                activeOpacity={1}
                                style={styles.userTagItem}
                                onPress={() => {
                                    selectTag(tag);
                                    navigation.goBack();
                                }}>
                                <View style={{ maxWidth: pixel(100) }}>
                                    <Text style={styles.userTagName} numberOfLines={1}>
                                        #{tag?.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={[styles.sectionHeader, { paddingVertical: pixel(5) }]}>
                        <Text style={styles.sectionTitle}>热门标签</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>热门标签</Text>
                </View>
            );
        }
    }, [tagsData]);

    const renderItem = useCallback(
        ({ item }) => {
            return <TagItem tagData={item} selectTag={selectTag} navigation={navigation} />;
        },
        [selectTag],
    );

    return (
        <View style={styles.container}>
            <FocusAwareStatusBar barStyle="dark-content" />
            <NavBarHeader
                title="标签"
                rightComponent={
                    <TouchableOpacity style={styles.addTagBtn} onPress={openAddTagModal} activeOpacity={1}>
                        <Text style={styles.addTagText}>添加</Text>
                    </TouchableOpacity>
                }
            />
            <QueryList
                contentContainerStyle={styles.contentContainer}
                gqlDocument={GQL.HotTagQuery}
                dataOptionChain="tags.data"
                paginateOptionChain="tags.paginatorInfo"
                options={{
                    variables: {
                        count: 10,
                    },
                }}
                renderItem={renderItem}
                ListHeaderComponent={renderUserTags}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    addTagBtn: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        paddingHorizontal: pixel(12),
    },
    addTagText: {
        color: '#4085FF',
        fontSize: font(15),
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
    },
    userTags: {},
    sectionHeader: {
        paddingHorizontal: pixel(12),
        paddingVertical: pixel(15),
    },
    sectionTitle: {
        color: '#969696',
        fontSize: font(15),
    },
    tagList: {
        paddingLeft: pixel(12),
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    userTagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: pixel(10),
        marginBottom: pixel(10),
        height: pixel(28),
        paddingLeft: pixel(8),
        paddingRight: pixel(9),
        borderWidth: pixel(1),
        borderRadius: pixel(14),
        borderColor: '#4085FF',
        backgroundColor: '#fff',
    },
    userTagName: {
        fontSize: font(12),
        color: '#4085FF',
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: pixel(12),
        paddingRight: pixel(15),
        paddingVertical: pixel(10),
    },
    tagNameWrap: {
        flex: 1,
        marginRight: pixel(20),
    },
    tagName: {
        color: '#2b2b2b',
        fontSize: font(15),
        fontWeight: 'bold',
    },
    countPlays: {
        color: '#b2b2b2',
        fontSize: font(12),
    },
});
