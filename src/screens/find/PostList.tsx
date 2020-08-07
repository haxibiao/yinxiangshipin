import React, { useContext, useState, useCallback, useEffect, useMemo, useRef, Fragment } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, StatusBar, Platform } from 'react-native';
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
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.container}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: Theme.BOTTOM_HEIGHT,
    },
    separator: {
        marginHorizontal: pixel(14),
        height: pixel(1),
        backgroundColor: '#f4f4f4',
    },
});
