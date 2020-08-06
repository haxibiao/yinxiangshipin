import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar, Platform } from 'react-native';
import { PageContainer, Placeholder, ItemSeparator, Avatar, SafeText, Iconfont, Like } from '@src/components';
import { observer, appStore } from '@src/store';
import { useNavigation } from '@src/router';
import { useDetainment } from '@src/common';
import { observable } from 'mobx';
import { QueryList, PostItem } from '@src/content';

export default observer((props: any) => {
    const renderItem = useCallback(({ item, index }) => {
        return <PostItem data={item} />;
    }, []);

    return (
        <QueryList
            renderItem={renderItem}
            ItemSeparatorComponent={() => <ItemSeparator />}
            contentContainerStyle={styles.container}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.BOTTOM_HEIGHT,
    },
    postContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: pixel(14),
        paddingHorizontal: pixel(14),
        backgroundColor: '#fff',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: pixel(14),
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(14),
    },
    info: {
        justifyContent: 'space-between',
        marginLeft: pixel(14),
    },
    timeAgoText: { fontSize: font(12), color: Theme.slateGray1, fontWeight: '300', marginTop: pixel(5) },
    nameText: { fontSize: font(14), color: '#2b2b2b' },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: pixel(34),
        justifyContent: 'center',
        marginRight: pixel(10),
        marginTop: pixel(10),
    },
    categoryName: {
        color: Theme.primaryColor,
        fontSize: font(13),
    },
    footer: {
        marginTop: pixel(10),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaList: {
        flex: 1,
        marginLeft: pixel(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: pixel(24),
    },
    countText: {
        color: '#CCD5E0',
        fontSize: font(14),
        marginLeft: pixel(12),
    },
});
